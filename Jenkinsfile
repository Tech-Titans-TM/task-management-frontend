pipeline {
  /* 6‑A) Build environment = disposable container */
  agent {
    docker {
      image 'mydockerid/node-awscli:22'
      // If you pushed to a private registry:
      // registryCredentialsId 'docker-hub-creds'
      args  '-u root:root'   // lets npm write to $HOME
    }
  }

  /* 6‑B) Globals */
  environment {
    S3_BUCKET  = 'tick-flow-frontend'   // 🔄 change to your bucket
    DIST_ID    = ''                 // CloudFront ID, leave blank if none
    CREDS      = credentials('aws-upload-creds')
    AWS_REGION = 'eu-north-1'
  }

  /* 6‑C) Pipeline stages */
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Install deps') { steps { sh 'npm ci' } }

    stage('Test') {        // delete if no tests
      steps { sh 'npm test -- --ci' }
    }

    stage('Build') { steps { sh 'npm run build' } }  // vite → dist/

    stage('Deploy to S3') {
      steps {
        withEnv([
          "AWS_ACCESS_KEY_ID=${CREDS_USR}",
          "AWS_SECRET_ACCESS_KEY=${CREDS_PSW}",
          "AWS_DEFAULT_REGION=${AWS_REGION}"
        ]) {
          sh '''
            # 1) Immutable assets (JS/CSS/images) – cache for a year
            aws s3 sync dist/ s3://$S3_BUCKET/ \
              --delete \
              --cache-control "public,max-age=31536000,immutable" \
              --exclude "*.html"

            # 2) HTML – no‑cache so browser grabs new bundle names
            aws s3 sync dist/ s3://$S3_BUCKET/ \
              --delete \
              --cache-control "no-cache" \
              --include "*.html"
          '''
        }
      }
    }

    stage('Invalidate CloudFront') {
      when { expression { return env.DIST_ID?.trim() } }
      steps {
        withEnv([
          "AWS_ACCESS_KEY_ID=${CREDS_USR}",
          "AWS_SECRET_ACCESS_KEY=${CREDS_PSW}",
          "AWS_DEFAULT_REGION=${AWS_REGION}"
        ]) {
          sh 'aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"'
        }
      }
    }
  }

  /* 6‑D) Friendly console note */
  post {
    success {
      echo "✅ Site live at http://tick-flow-frontend.s3-website.eu-north-1.amazonaws.com"
    }
  }
}
