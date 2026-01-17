class ProductGallery {
  constructor() {
    this.theme = window.THEME || 'traditional';
    this.currentCategory = 'all';
    this.products = [];
    this.grid = document.getElementById('product-grid');
    this.countEl = document.getElementById('product-count');
    this.filterBtns = document.querySelectorAll('.filter-btn');

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadProducts();
  }

  bindEvents() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        this.applyFilter(category);

        // 활성 버튼 변경
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  async loadProducts() {
    try {
      const response = await fetch(`/api/products?theme=${this.theme}`);
      const data = await response.json();
      this.products = data.products || [];
      this.renderProducts(this.products);
    } catch (error) {
      console.error('제품 로드 실패:', error);
    }
  }

  applyFilter(category) {
    this.currentCategory = category;

    const filtered = category === 'all'
      ? this.products
      : this.products.filter(p => p.category === category);

    this.renderProducts(filtered);
  }

  renderProducts(products) {
    this.countEl.textContent = products.length;

    this.grid.innerHTML = products.map(product => `
      <a href="/product/${product.id}" class="product-unit neu-card">
        <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-code">${product.code}</p>
          <p class="product-price">${this.formatPrice(product.buy_price)}</p>
        </div>
      </a>
    `).join('');
  }

  formatPrice(price) {
    return '₩' + price.toLocaleString('ko-KR');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductGallery();
});
