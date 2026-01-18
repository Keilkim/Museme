import sys
import os

# 프로젝트 경로 설정
project_home = '/home/kimseunghun/muzme'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# app 폴더를 경로에 추가
app_path = os.path.join(project_home, 'app')
if app_path not in sys.path:
    sys.path.insert(0, app_path)

# 데이터베이스 초기화
from init_db import init_db
init_db()

# Flask 앱 가져오기
from main import create_app
application = create_app()
