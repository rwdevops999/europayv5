@Library("shared-library@master") _

def isValid = true

pipeline {
  agent {label 'macos'}

	// environment {
  //   	// PATH = "/usr/local/bin:${env.PATH}"
  //   DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
  //   IMAGE_NAME = 'rwdevops999/europay'
  //   IMAGE_TAG = 'latest'
  // }

  // tools { nodejs "nodejs" }
  
  stages {
    stage("info") {
      steps {
        sh 'PATH=$PATH:/usr/local/bin/node'
        sh 'echo $PATH'
        sh 'node -v'
        // sh 'npm install -g pnpm@latest-10'
        // sh 'pnpm -v'
        // sh 'docker -v'
      }
    }

    // stage("build production application") {
    //   steps {
    //     sh 'pnpm install --no-frozen-lockfile'
    //     sh 'npx prisma generate'
    //     sh 'pnpm build'
    //   }
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
  //   // always {
  //   //   sh 'docker logout'
  //   // }
  // }
}
