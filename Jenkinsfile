// @Library("shared-library@master") _

def isValid = true

pipeline {
  agent {label 'macos'}

	environment {
    DATABASE_URL='postgresql://postgres:postgres@localhost:5432/europayv5_db?schema=public&pool_timeout=0'
    DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
  	KEYCHAIN = credentials('keychain')
    USER = 'rwdevops999'
    IMAGE_NAME = 'europay'
    IMAGE_TAG = 'latest'
    // isRunning = false
  }

  stages {
    stage("info") {
      steps {
        sh 'node -v'
        sh 'pnpm -v'
        sh 'docker -v'
        sh 'git -v'
        env.isRunning = false;
      }
    }

  stage("exists") {
    steps {
      // sh '''#!/bin/bash
      //   if [ "$(  docker container inspect -f '{{.State.Status}}' 'europayapp')" = "running" ];
      //   then 
      //     echo "Container IS running"
      //     $env.isRunning = true
      //   else
      //     echo "Container IS NOT running"
      //   fi
      // '''
      sh 'echo ENV ${env.isRunning}'
    }
  }

  // stage("test") {
  //     when {
  //       expression {
  //         isRunning
  //       }
  //     }

  //     steps {
  //       sh "echo RUNNING"
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
