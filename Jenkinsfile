pipeline {
    agent none
    options { skipDefaultCheckout(true) }
    stages {
        stage('Checkout repository') {
            agent any
            steps {
                checkout scm
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'node:14'
                }
            }
            steps {
                sh 'yarn'
                sh 'yarn build'
            }
        }
    }
}