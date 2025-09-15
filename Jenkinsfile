@Library("shared-library@master") _

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
  }

  // post {
  //   success {
  //     mailTo(to: 'rudi.welter@gmail.com', attachLog: false)
  //   }

  //   failure {
  //     mailTo(to: 'rudi.welter@gmail.com', attachLog: true)

  //   }
  // }
}
