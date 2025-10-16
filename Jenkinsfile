@Library('pipeline-lib') _

 def runConditions = {
        anyOf {
            changeset 'src/**'
            changeset 'package.json'
            changeset 'package-lock.json'
            changeset "Jenkinsfile"
            expression { return params.FORCE_RUN }
        }
    }

pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'FORCE_RUN',
            defaultValue: false,
            description: 'Forces run even if there are no changes'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies Frontend') {
            when {
                anyOf {
                    changeset 'src/**'
                    changeset 'package.json'
                    changeset 'package-lock.json'
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_RUN }
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            when {
                anyOf {
                    changeset 'src/**'
                    changeset 'package.json'
                    changeset 'package-lock.json'
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_RUN }
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy Frontend') {
            when {
                anyOf {
                    changeset 'src/**'
                    changeset 'package.json'
                    changeset 'package-lock.json'
                    changeset 'nginx.conf'
                    changeset "Jenkinsfile"
                    expression { return params.FORCE_RUN }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'vps-username', variable: 'USERNAME'),
                    string(credentialsId: 'vps-domain', variable: 'DOMAIN')
                ]) {
                    scpBuildFilesToWWW(USERNAME, DOMAIN, 'tic-tac-toe.qrcool.ca')
                    updateNginxConf(USERNAME, DOMAIN, 'tic-tac-toe.qrcool.ca')
                }
            }

        }
    }
}
