pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "your-dockerhub-username/simple-node-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    triggers {
        githubPush() // Enables the webhook trigger
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test' 
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Requires SonarQube Scanner plugin installed in Jenkins
                withSonarQubeEnv('SonarQube-Server') { 
                    sh 'sonar-scanner -Dsonar.projectKey=node-app -Dsonar.sources=.'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    // Forces the pipeline to fail if SonarQube quality gate fails
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('Docker Push') {
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy') {
            steps {
                // Example of local or staging deployment via SSH/Local Shell
                echo "Deploying application..."
                // Stop older container if exists
                sh "docker stop node-app-instance || true && docker rm node-app-instance || true"
                // Run the newly built container
                sh "docker run -d -p 3000:3000 --name node-app-instance ${IMAGE_NAME}:latest"
            }
        }
    }

    post {
        always {
            // Clean up workspace and local Docker images to save space
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest || true"
            cleanWs()
        }
    }
}
