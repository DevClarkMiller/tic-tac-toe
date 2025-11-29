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
        USERNAME = credentials('vps-username')
        DOMAIN = credentials('vps-domain')
        JENKINS = 'Jenkinsfile'
        CLIENT_DIR = 'client'
        API_DIR = 'api'
    }

    stages {
        stage('Determine Changes and run pipelines') {
            steps {
                checkout scm

                script {
                    services = [
                        'tic-tac-toe.api': 'api',
                        'tic-tac-toe.client': 'client',
                        // 'data': 'data'
                    ]

                    toTrigger = []
                    services.each { service, path ->
                        if (params.FORCE_RUN || checkMicroservice(path)) {
                            echo "Changes detected in ${service}, will trigger pipelines."
                            toTrigger << service // Add to the list
                        } else {
                            echo "No changes in ${service}, skipping."
                        }
                    }

                    if (toTrigger.isEmpty()) {
                        echo "No services changed. Nothing to trigger."
                    }

                    toTrigger.each { service -> 
                        echo "Triggering ${service}..."
                        build job: service,
                                parameters: [
                                    booleanParam(name: 'All', value: params.All),
									booleanParam(name: 'Dev', value: params.Dev),
									booleanParam(name: 'Prod', value: params.Prod)
                                ],
                                wait: true // set false for async
                        echo "${service} finished."
                    }
                }
            }
        }
    }
}
