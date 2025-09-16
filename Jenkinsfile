@Library("shared-library@master") _

def isValid = true

pipeline {
  agent {label 'macos'}

	environment {
    DATABASE_URL='postgresql://postgres:postgres@localhost:5432/europayv5_db?schema=public&pool_timeout=0'
    	// PATH = "/usr/local/bin:${env.PATH}"
    DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
  	KEYCHAIN_PSW = credentials('keychain')
    USER = 'rwdevops999'
    IMAGE_NAME = 'europayXXX'
    // IMAGE_NAME = 'europay'
    IMAGE_TAG = 'latest'
  }

  stages {
    stage("info") {
      steps {
        sh 'node -v'
        sh 'pnpm -v'
        sh 'docker -v'
      }
    }

    // stage("build prisma and production application") {
    //   steps {
    //     sh 'pnpm install --no-frozen-lockfile'
    //     sh 'npx prisma generate'
    //     sh 'pnpm build'
    //   }

    //   post {
    //     failure {
    //       script {
    //         isValid = false
    //       }
    //     }
    //   }
    // }

    stage("package") {
      when {
        expression {
          isValid
        }
      }

      steps {
        sh '''
					docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}
        '''
					// docker build . -t ${IMAGE}
      }

      post {
        failure {
          script {
            isValid = false
          }
        }
      }
    }

    // stage("publish") {
    //   when {
    //     expression {
    //       isValid
    // 		}
		// 	}

		// 	steps {
		// 		sh '''
		// 			docker logout registry-1.docker.io
		// 			docker tag ${IMAGE} ${USER}/${IMAGE}
		// 			docker push ${USER}/${IMAGE}
		// 		'''
		// 	}

		// 	post {
		// 		success {
		// 			sh '''
		// 				docker rmi -f ${IMAGE}:latest
		// 				docker rmi -f ${USER}/${IMAGE}:latest
		// 			'''					
		// 	        script {
    //     			    isValid = true
    //     			}
		// 		}

		// 		failure {
		// 	    script {
    //         isValid = false
    //     	}
		// 		}
		// 	}
    // }

		// stage("init") {
		// 	steps {
		// 		// build job: 'DockerCompose', parameters: [string(name: 'COMPOSE', value: 'DOWN' )], wait: true 
		// 	    sh 'pnpm install --frozen-lockfile'
		// 	}
     
    //   post {
    //     failure {
    //       script {
    //         isValid = false
    //       }
    //     }
    //   }
    // }

    // stage("build") {
    //   when {
    //     expression {
    //       isValid
    //     }
    //   }

    //   steps {
		// 		sh 'docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}'
    //     sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
    //   }

    //   post {
    //     failure {
    //       script {
    //         isValid = false
    //       }
    //     }
    //   }
    // }

    // stage("package") {
    //   when {
    //     expression {
    //       isValid
    //     }
    //   }

    //   steps {
    //     sh '''
    //     '''
    //   }
    // }
	}

  // post {
  //   success {
  //     sh 'echo "SUCCESS"'
  //     // mailTo(to: 'rudi.welter@gmail.com', attachLog: false)
  //   }

  //   failure {
  //     sh 'echo "FAILURE"'
  //     // mailTo(to: 'rudi.welter@gmail.com', attachLog: true)
  //   }
  //   always {
  //     sh 'docker logout'
  //   }
  // }
}

