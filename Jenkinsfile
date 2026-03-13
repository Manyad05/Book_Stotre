pipeline {

agent any

environment {

AWS_REGION = "ap-south-1"
ECR_REPO = "280020694900.dkr.ecr.ap-south-1.amazonaws.com/book-store-react"
IMAGE_TAG = "latest"

}

tools {
nodejs "NodeJS"
}

stages {

stage('Checkout Code') {
steps {
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
sh 'npm test -- --watchAll=false'
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

stage('Build React Application') {
steps {
sh 'npm run build'
}
}

stage('Build Docker Image') {
steps {
sh 'docker build -t book-store-react .'
}
}

stage('Trivy Security Scan') {
steps {
sh 'trivy image book-store-react'
}
}

stage('Login to ECR') {
steps {
sh '''
aws ecr get-login-password --region $AWS_REGION \
| docker login \
--username AWS \
--password-stdin $ECR_REPO
'''
}
}

stage('Tag Docker Image') {
steps {
sh '''
docker tag book-store-react:latest \
$ECR_REPO:$IMAGE_TAG
'''
}
}

stage('Push Image to ECR') {
steps {
sh '''
docker push $ECR_REPO:$IMAGE_TAG
'''
}
}

}

post {

success {
emailext(
subject: "SUCCESS: Jenkins Build ${env.BUILD_NUMBER}",
body: "Pipeline executed successfully for ${env.JOB_NAME}",
to: "par642662@gmail.com"
)
}

failure {
emailext(
subject: "FAILED: Jenkins Build ${env.BUILD_NUMBER}",
body: "Pipeline failed for ${env.JOB_NAME}. Check Jenkins logs.",
to: "par642662@gmail.com"
)
}

}

}