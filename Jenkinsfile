pipeline {
    agent any

    environment {
        AWS_REGION     = "ap-south-1"
        AWS_ACCOUNT_ID = "280020694900"
        ECR_REPO       = "book-store-react"
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG      = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh '''
                  docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Authenticate to ECR') {
            steps {
                sh '''
                  aws ecr get-login-password --region ${AWS_REGION} \
                  | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                '''
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                  docker tag ${ECR_REPO}:${IMAGE_TAG} \
                  ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                  docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "CI pipeline completed successfully"
        }
        failure {
            echo "CI pipeline failed"
        }
    }
}
