import sqlite3
from contextlib import contextmanager
import os

DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'museme.db')

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_products(theme=None, category=None):
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM products WHERE 1=1"
        params = []

        if theme:
            query += " AND theme = ?"
            params.append(theme)
        if category and category != 'all':
            query += " AND category = ?"
            params.append(category)

        cursor.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]

def get_product_by_id(product_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        product = cursor.fetchone()

        if product:
            product = dict(product)
            # 이미지 가져오기
            cursor.execute(
                "SELECT image_url, image_type FROM product_images WHERE product_id = ?",
                (product_id,)
            )
            images = cursor.fetchall()
            product['detail_images'] = [r['image_url'] for r in images if r['image_type'] == 'detail']
            product['wearing_shots'] = [r['image_url'] for r in images if r['image_type'] == 'wear']

        return product

def get_user_by_email(email):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        return dict(user) if user else None

def create_user(email, password_hash):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (email, password_hash)
        )
        conn.commit()
        return cursor.lastrowid
