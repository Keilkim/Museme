from flask import Blueprint, request, jsonify
import jwt
import hashlib
from datetime import datetime, timedelta
from database import get_user_by_email, create_user

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = 'your-secret-key-change-in-production'

def verify_password(stored_hash, password):
    return stored_hash == password

def generate_token(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': '이메일과 비밀번호를 입력해주세요.'}), 400

    user = get_user_by_email(email)

    if not user or not verify_password(user['password_hash'], password):
        return jsonify({'error': '이메일 또는 비밀번호가 올바르지 않습니다.'}), 401

    token = generate_token(user['id'], user['email'])

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email']
        }
    })

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({'message': '로그아웃 되었습니다.'})

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': '이메일과 비밀번호를 입력해주세요.'}), 400

    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({'error': '이미 등록된 이메일입니다.'}), 400

    user_id = create_user(email, password)
    token = generate_token(user_id, email)

    return jsonify({
        'token': token,
        'user': {
            'id': user_id,
            'email': email
        }
    }), 201
