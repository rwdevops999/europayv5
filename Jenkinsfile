@Library("shard-library@master") _

pipeline {
  agent {label 'macos'}

  stages {
    stage("info") {
      steps {
        sh 'node -v'
        sh 'pnpm -v'
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
