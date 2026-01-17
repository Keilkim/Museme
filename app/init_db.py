import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'museme.db')

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # 사용자 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 제품 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            material TEXT,
            buy_price INTEGER NOT NULL,
            rent_price INTEGER,
            theme TEXT NOT NULL,
            category TEXT NOT NULL,
            thumbnail TEXT,
            main_image TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 제품 이미지 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            image_url TEXT NOT NULL,
            image_type TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')

    # 샘플 데이터 추가
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ('전통 귀걸이 세트', 'TRAD-EAR-001', '실버 925', 150000, 30000, 'traditional', 'earring', '/static/images/products/sample1.jpg', '전통적인 한국 문양이 새겨진 귀걸이입니다.'),
            ('전통 목걸이', 'TRAD-NECK-001', '실버 925, 진주', 250000, 50000, 'traditional', 'necklace', '/static/images/products/sample2.jpg', '고급스러운 전통 목걸이입니다.'),
            ('데일리 반지', 'DAILY-RING-001', '스테인리스', 50000, 10000, 'daily', 'ring', '/static/images/products/sample3.jpg', '일상에서 편하게 착용할 수 있는 반지입니다.'),
        ]

        for name, code, material, buy_price, rent_price, theme, category, thumbnail, description in sample_products:
            cursor.execute('''
                INSERT INTO products (name, code, material, buy_price, rent_price, theme, category, thumbnail, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, code, material, buy_price, rent_price, theme, category, thumbnail, description))

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
