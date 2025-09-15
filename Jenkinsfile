@Library("shared-library@master") _

def isValid = true

pipeline {
  agent {label 'macos'}

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

      steps {
        sh '''
          echo ${DOCKERHUB_ACCESSKEY_USR}
          echo ${DOCKERHUB_ACCESSKEY_PWD}
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
