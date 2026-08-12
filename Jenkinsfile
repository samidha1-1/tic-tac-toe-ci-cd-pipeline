
// pipeline {
//     agent any

//     stages {

//         stage('Checkout Latest Code') {
//             steps {
//                 deleteDir()
//                 checkout scm
//                 sh 'git rev-parse HEAD'
//             }
//         }

//         stage('Build Frontend Image') {
//             steps {
//                 dir('frontend') {
//                     sh 'docker build --no-cache -t student-frontend .'
//                 }
//             }
//         }

//         stage('Build Backend Image') {
//             steps {
//                 dir('backend') {
//                     sh 'docker build --no-cache -t student-backend .'
//                 }
//             }
//         }

//         stage('Run Backend') {
//             steps {
//                 sh '''
//                 docker stop backend-container || true
//                 docker rm backend-container || true

//                 docker run -d --name backend-container -p 5000:5000 student-backend
//                 '''
//             }
//         }

//         stage('Run Frontend') {
//             steps {
//                 sh '''
//                 docker stop frontend-container || true
//                 docker rm frontend-container || true

//                 docker run -d --name frontend-container -p 8081:80 student-frontend
//                 '''
//             }
//         }
//     }
// }


// Creating a declarative jenkins file for the project and deploying it on k3s cluster 



pipeline {
    agent any 

    environment {
        DOCKERHUB_USERNAME = 'samidha7'

        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/tic-tac-toe-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/tic-tac-toe-backend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }


    stages {
        stage('Checkout Latest Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/samidha1-1/tic-tac-toe-ci-cd-pipeline.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy to k3s Cluster') {
            steps {
                sh '''
                    kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} 
                    kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE}:${IMAGE_TAG} 

                    kubectl rollout status deployment/frontend-deployment
                    kubectl rollout status deployment/backend-deployment
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for details.'
        }
    }
}
