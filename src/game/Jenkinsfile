@Library('pipeline-lib') _

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies Frontend') {
            when {
                anyOf {
                    changeset '**/src/**'
                    changeset '**/package.json'
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            when {
                anyOf {
                    changeset '**/src/**'
                    changeset '**/package.json'
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy Frontend') {
            when {
                anyOf {
                    changeset '**/src/**'
                    changeset '**/package.json'
                }
            }
            steps {
                scpBuildFilesToWWW('clark', 'clarkmiller.ca', 'tic-tac-toe.qrcool.ca')
                updateNginxConf('clark', 'clarkmiller.ca', 'tic-tac-toe.qrcool.ca')
            }
        }
    }
}
