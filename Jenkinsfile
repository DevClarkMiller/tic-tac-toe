@Library('pipeline-lib') _

pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'All',
            defaultValue: false,
            description: 'Runs all even if there are no changes'
        )

        booleanParam(
            name: 'Dev',
            defaultValue: false,
            description: 'Runs dev even if there are no changes'
        )

        booleanParam(
            name: 'Prod',
            defaultValue: false,
            description: 'Runs prod even if there are no changes'
        )
    }

    environment {
        DEV_CLIENT_HOSTNAME = 'dev.tic-tac-toe.qrcool.ca'
        PROD_CLIENT_HOSTNAME = 'tic-tac-toe.qrcool.ca'
        USERNAME = credentials('vps-username')
        DOMAIN = credentials('vps-domain')
        PACKAGE = 'client/package.json'
        PACKAGE_LOCK = 'client/package-lock.json'
        JENKINS = 'Jenkinsfile'
        SRC = 'client/src/**'
        DEV_NGINX_CONF = 'nginx.dev.conf'
        PROD_NGINX_CONF = 'nginx.prod.conf'
        CLIENT_DIR = 'client'
        API_DIR = 'api'
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
                    changeset SRC
                    changeset PACKAGE
                    changeset PACKAGE_LOCK
                    changeset JENKINS
                    expression { return params.All || params.Dev || params.Prod }
                }
            }
            steps {
                dir(CLIENT_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend Dev') {
            when {
                anyOf {
                    changeset SRC
                    changeset PACKAGE
                    changeset PACKAGE_LOCK
                    changeset JENKINS
                    expression { return params.All || params.Dev }
                }
            }
            steps {
                dir(CLIENT_DIR) {
                    sh 'npm run build:dev'
                }
            }
        }

        stage('Deploy Frontend Dev') {
            when {
                anyOf {
                    changeset SRC
                    changeset PACKAGE
                    changeset PACKAGE_LOCK
                    changeset JENKINS
                    expression { return params.All || params.Dev }
                }
            }
            steps {
                dir(CLIENT_DIR) {
                    scpBuildFilesToWWW(USERNAME, DOMAIN, DEV_CLIENT_HOSTNAME)
                }
            }
        }

        stage('Update Nginx Dev') {
            when {
                anyOf {
                    changeset "${CLIENT_DIR}/${DEV_NGINX_CONF}"
                    expression { return params.All || params.Dev }
                }
            }
            steps {
                dir(CLIENT_DIR) {
                    updateNginxConf(USERNAME, DOMAIN, DEV_CLIENT_HOSTNAME, DEV_NGINX_CONF)
                }
            }
        }

        stage('Build Frontend Prod') {
            when {
                expression { return params.All || params.Prod }
            }
            steps {
                dir(CLIENT_DIR) {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Frontend Prod') {
            when {
                expression { return params.All || params.Prod }
            }
            steps {
                dir(CLIENT_DIR) {
                    scpBuildFilesToWWW(USERNAME, DOMAIN, PROD_CLIENT_HOSTNAME)
                }
            }
        }

        stage('Update Nginx Prod') {
            when {
                anyOf {
                    changeset "${CLIENT_DIR}/${PROD_NGINX_CONF}"
                    expression { return params.All || params.Prod }
                }
            }
            steps {
                dir(CLIENT_DIR) {
                    updateNginxConf(USERNAME, DOMAIN, PROD_CLIENT_HOSTNAME, PROD_NGINX_CONF)
                }
            }
        }
    }
}
