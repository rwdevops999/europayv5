@Library("shared-library@master") _

def isValid = true

pipeline {
  agent {label 'macos'}

	environment {
    	// PATH = "/usr/local/bin:${env.PATH}"
    USER = 'rwdevops999'
    IMAGE = 'europay'
  }

  tools {nodejs "nodejs"}

  stages {
    stage("info") {
      steps {
        sh 'node -v'
        sh 'npm install -g pnpm@latest-10 --legace-peer-deps'
        sh 'pnpm -v'
      }
    }

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

			environment {
			  DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
			  // KEYCHAIN_PSW = credentials('keychain')
			}

      steps {
        sh '''
					docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}
					docker build . -t ${IMAGE}
        '''
      }
    }
	}

  post {
    success {
      mailTo(to: 'rudi.welter@gmail.com', attachLog: false)
    }

    failure {
      mailTo(to: 'rudi.welter@gmail.com', attachLog: true)
    }
  }
}
