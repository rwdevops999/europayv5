// @Library("shared-library@master") _

def isValid = true
def isRunning = -1

pipeline {
  agent {label 'macos'}

	environment {
    DATABASE_URL='postgresql://postgres:postgres@localhost:5432/europayv5_db?schema=public&pool_timeout=0'
    DOCKERHUB_ACCESSKEY = credentials('DockerhubCredentials')
  	KEYCHAIN = credentials('KeychainCredentials')
    USER = 'rwdevops999'
    IMAGE_NAME = 'europay'
    IMAGE_TAG = 'latest'
  }


  stages {
    stage("info") {
      steps {
        sh 'node -v'
        sh 'pnpm -v'
        sh 'docker -v'
        sh 'git -v'
      }
    }

    stage("check container is running") {
      steps {
        script {
          isRunning = sh (
            script: "docker container inspect -f {{.State.Running}} 'europayapp'",
            returnStatus: true
          ) == 0
          echo "is running: ${isRunning}"
        }
      }
    }

    stage("when container is running bring it down") {
      when {
        expression {
          isRunning
        }
      }

      steps {
        sh "docker compose down"
      }
  }

    stage("build image") {
		  steps {
        sh '''
          security unlock-keychain -p ${KEYCHAIN_PSW}
          docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}
          docker build . -t ${IMAGE_NAME}
        '''
      }

      post {
        failure {
          script {
            isValid = false
          }
        }
      }
    }

    stage("tag image and delete untagged image") {
      when {
        expression {
          isValid
        }
      }

 		  steps {
        sh '''
 					docker tag ${IMAGE_NAME} ${USER}/${IMAGE_NAME}
          docker rmi ${IMAGE_NAME}:latest
        '''
      }

      post {
        failure {
          script {
            isValid = false
          }
        }
      }
    }
  
    stage("publish to Dockerhub") {
      when {
        expression {
          isValid
        }
      }

 		  steps {
        sh '''
 					docker push ${USER}/${IMAGE_NAME}
        '''
      }

      post {
        failure {
          script {
            isValid = false
          }
        }
      }
    }
  
    stage("when container was running bring it up") {
      when {
        expression {
          isRunning
        }
      }

      steps {
        sh "docker compose up -d"
      }
    }

    stage("Application check") {
      when {
        isRunning
      }
            
      steps {
        sh '''
          chmod 777 servercheck.sh
          ./servercheck.sh
        '''
      }
    }
  }

  post {
    // success {
    //   mailTo(to: 'rudi.welter@gmail.com', attachLog: false)
    // }

    // failure {
    //   mailTo(to: 'rudi.welter@gmail.com', attachLog: true)
    // }

    always {
      sh '''
        docker logout registry-1.docker.io
      '''
    }
  }
}
