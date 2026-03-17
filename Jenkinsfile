pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        AWS_REGION   = "ap-south-1"
        ECR_REGISTRY = "280020694900.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPO     = "280020694900.dkr.ecr.ap-south-1.amazonaws.com/my-app"
        IMAGE_TAG    = "${env.BUILD_NUMBER}"
        ECS_CLUSTER  = "bookstore-cluster"
        ECS_SERVICE  = "book-store-task-service-1hkimego"
    }

    stages {

        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Install (Fast)') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test (Quick)') {
            steps {
                sh 'npm test -- --watchAll=false || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t my-app:${IMAGE_TAG} ."
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
                        | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        docker tag my-app:${IMAGE_TAG} ${ECR_REPO}:latest
                        docker push ${ECR_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy to ECS (Fast)') {
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

                        echo "🚀 Deployment triggered (no wait)"
                    """
                }
            }
        }

        stage('Get Public IP') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        sleep 15

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

                        echo "🌐 App: http://\$PUBLIC_IP"
                    """
                }
            }
        }
    }

    post {
        always {
            sh """
                docker rmi my-app:${IMAGE_TAG} || true
                docker image prune -f || true
            """
            cleanWs()
        }
    }
}