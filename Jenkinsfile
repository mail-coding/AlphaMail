pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📦 Git 저장소에서 코드 체크아웃 중...'
        checkout scm
      }
    }

    stage('Build & Deploy with Docker Compose') {
      steps {

        echo '🔐 Jenkins에서 환경 변수 주입 확인 중...'
        sh 'echo $DB_URL && echo $DB_USERNAME && echo $DB_PASSWORD'

        echo '🧹 기존 컨테이너 및 오브젝트 정리 중...'
        sh 'docker compose -f $COMPOSE_FILE down --remove-orphans || true'
        
        echo '🗑️ 안 쓰는 Docker 이미지 정리 중...'
        sh 'docker image prune -af || true'  // 이미지까지 싹 정리 (선택적)

        echo '🚀 컨테이너 빌드 및 재시작 중...'
        sh 'docker compose -f $COMPOSE_FILE up -d --build'
      }
    }
  }

  post {
    success {
      echo '✅ 배포 성공!'
    }
    failure {
      echo '❌ 배포 실패...'
    }
  }
}
