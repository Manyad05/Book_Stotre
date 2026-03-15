pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION   = "ap-south-1"
        ECR_REGISTRY = "280020694900.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPO     = "280020694900.dkr.ecr.ap-south-1.amazonaws.com/my-app"
        IMAGE_TAG    = "${env.BUILD_NUMBER}"
        ECS_CLUSTER  = "bookstore-cluster"
        ECS_SERVICE  = "book-store-task-service-1hkimego"
    }

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Checkout Code') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test -- --watchAll=false --coverage'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=book-store \
                          -Dsonar.sources=src \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build React Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t my-app:${IMAGE_TAG} ."
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh "trivy image --severity HIGH,CRITICAL my-app:${IMAGE_TAG}"
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} \
                          | docker login \
                              --username AWS \
                              --password-stdin ${ECR_REGISTRY}

                        docker tag my-app:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}
                        docker tag my-app:${IMAGE_TAG} ${ECR_REPO}:latest

                        docker push ${ECR_REPO}:${IMAGE_TAG}
                        docker push ${ECR_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        aws ecs update-service \
                          --cluster ${ECS_CLUSTER} \
                          --service ${ECS_SERVICE} \
                          --force-new-deployment \
                          --region ${AWS_REGION}

                        echo "⏳ Waiting for deployment to stabilize..."

                        aws ecs wait services-stable \
                          --cluster ${ECS_CLUSTER} \
                          --services ${ECS_SERVICE} \
                          --region ${AWS_REGION}

                        echo "✅ Deployed to ECS!"
                    """
                }
            }
        }

        stage('Get App URL') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        TASK_ID=\$(aws ecs list-tasks \
                          --cluster ${ECS_CLUSTER} \
                          --desired-status RUNNING \
                          --region ${AWS_REGION} \
                          --query 'taskArns[0]' \
                          --output text)

                        ENI=\$(aws ecs describe-tasks \
                          --cluster ${ECS_CLUSTER} \
                          --tasks \$TASK_ID \
                          --region ${AWS_REGION} \
                          --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
                          --output text)

                        PUBLIC_IP=\$(aws ec2 describe-network-interfaces \
                          --network-interface-ids \$ENI \
                          --region ${AWS_REGION} \
                          --query 'NetworkInterfaces[0].Association.PublicIp' \
                          --output text)

                        echo "🚀 App live at: http://\$PUBLIC_IP"
                    """
                }
            }
        }
    }

    post {
        always {
            sh """
                docker rmi my-app:${IMAGE_TAG} || true
                docker rmi ${ECR_REPO}:${IMAGE_TAG} || true
                docker image prune -f || true
            """
            cleanWs()
        }
        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Deployment Successful!</h3>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                    <p><b>Image:</b> ${env.ECR_REPO}:${env.IMAGE_TAG}</p>
                    <p><b>ECS Service:</b> ${env.ECS_SERVICE} ✅</p>
                    <p><a href="${env.BUILD_URL}">View Build</a></p>
                """,
                to: "par642662@gmail.com",
                mimeType: 'text/html'
            )
        }
        failure {
            emailext(
                subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h3>Deployment Failed!</h3>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                    <p><a href="${env.BUILD_URL}">View Logs</a></p>
                """,
                to: "par642662@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}
