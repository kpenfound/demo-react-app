pipeline {
  agent { label 'dagger' }
  
  environment {
    _EXPERIMENTAL_DAGGER_CLOUD_TOKEN = "a276ce43-e1ca-4427-a6ee-200d77b85b56"
  }
  stages {
    stage("dagger") {
      steps {
        sh '''
            npm config set prefix '/home/jenkins/.npm-global'
            . /home/jenkins/.profile
            export PATH=$PATH:/home/jenkins/.npm-global/bin
            ls -la /home/jenkins/.npm-global
            dagger run npm run ci
        '''
      }
    }
  }
}