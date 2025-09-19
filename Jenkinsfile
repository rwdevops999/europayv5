// @Library("shared-library@master") _

def isValid = true
def isRun = true
def _isRun = false

pipeline {
  agent {label 'macos'}

	environment {
    DATABASE_URL='postgresql://postgres:postgres@localhost:5432/europayv5_db?schema=public&pool_timeout=0'
    DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
  	KEYCHAIN = credentials('keychain')
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

  // stage("exists") {
  //   steps {
  //     sh '''
  //       if [ "$(  docker container inspect -f '{{.State.Status}}' 'europayapp')" = "running" ];
  //       then 
  //         echo "Container IS running"
  //         #!/bin/bash
  //         export isRun=true
  //       else
  //         echo "Container IS NOT running"
  //         #!/bin/bash
  //         export isRun=false
  //       fi
  //       echo RESULT \$isRun
  //     '''
  //   }
  // }

  stage("test0") {
      steps {
        _isRun = sh(script: $(docker container inspect -f '{{.State.Running}}' 'europayapp') = "true")
        prinln _isRun
      }
  }

  stage("test1") {
      steps {
        println _isRun
      }
  }


  // stage("test1") {
  //     when {
  //       expression {
  //         isRun
  //       }
  //     }

  //     steps {
  //       sh "echo RUNNING"
  //     }
  // }

  // stage("test2") {
  //     when {
  //       expression {
  //         ! isRun
  //       }
  //     }

  //     steps {
  //       sh "echo NOT RUNNING"
  //     }
  // }
  //   stage("build prisma and production application") {
  //     steps {
  //       sh 'pnpm install --no-frozen-lockfile'
  //       sh 'pnpm build'
  //     }

  //     post {
  //       failure {
  //         script {
  //           isValid = false
  //         }
  //       }
  //     }
  //   }

  //   stage("package") {
  //     when {
  //       expression {
  //         isValid
  //       }
  //     }

  //     steps {
  //       sh '''
  //         echo $KEYCHAIN_PSW
  //         echo ${KEYCHAIN_PSW}
	// 				security unlock-keychain -p ${KEYCHAIN_PSW}
	// 				docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}
	// 				docker build . -t ${IMAGE_NAME}
  //       '''
  //     }

  //     post {
  //       failure {
  //         script {
  //           isValid = false
  //         }
  //       }
  //     }
  //   }

  //   stage("publish") {
  //     when {
  //       expression {
  //         isValid
  //   		}
	// 		}

	// 		steps {
	// 				// docker logout registry-1.docker.io
	// 			sh '''
	// 				docker tag ${IMAGE_NAME} ${USER}/${IMAGE_NAME}
	// 				docker push ${USER}/${IMAGE_NAME}
	// 			'''
	// 		}

	// 		post {
	// 			success {
	// 				sh '''
  //           echo "Removing images"
	// 					docker rmi -f ${IMAGE_NAME}:latest
	// 					docker rmi -f ${USER}/${IMAGE_NAME}:latest
	// 				'''					
	// 		        script {
  //       			    isValid = true
  //       			}
	// 			}

	// 			failure {
	// 		    script {
  //           isValid = false
  //       	}
	// 			}
	// 		}
  //   }
  // }
  }
}
