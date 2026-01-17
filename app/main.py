from flask import Flask
from routes import register_routes
from auth_routes import auth_bp
import os

def create_app():
    app = Flask(__name__,
                template_folder='../templates',
                static_folder='../static')

    app.secret_key = 'your-secret-key-change-in-production'

    # 블루프린트 등록
    app.register_blueprint(auth_bp)

    # 라우트 등록
    register_routes(app)

    return app

if __name__ == '__main__':
    # 데이터베이스 초기화
    from init_db import init_db
    init_db()

    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
