from flask import render_template, jsonify, request
from database import get_products, get_product_by_id

THEME_NAMES = {
    'traditional': '전통',
    'daily': '데일리',
    'party': '파티',
    'princess': '공주왕자',
    'idol': '아이돌',
    'country': '국가별'
}

def register_routes(app):

    @app.route('/')
    def index():
        return render_template('pages/index.html')

    @app.route('/products/<theme>')
    def products(theme):
        theme_name = THEME_NAMES.get(theme, theme)
        return render_template('pages/products.html',
                             theme=theme,
                             theme_name=theme_name)

    @app.route('/product/<int:product_id>')
    def product_detail(product_id):
        return render_template('pages/product-detail.html',
                             product_id=product_id)

    @app.route('/about')
    def about():
        return render_template('pages/about.html')

    @app.route('/terms')
    def terms():
        return render_template('pages/terms.html')

    @app.route('/privacy')
    def privacy():
        return render_template('pages/privacy.html')

    # API 엔드포인트
    @app.route('/api/products')
    def api_products():
        theme = request.args.get('theme')
        category = request.args.get('category')
        products = get_products(theme=theme, category=category)
        return jsonify({'products': products})

    @app.route('/api/product/<int:product_id>')
    def api_product(product_id):
        product = get_product_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        return jsonify(product)
