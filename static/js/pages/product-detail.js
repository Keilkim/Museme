class ProductDetail {
  constructor() {
    this.productId = window.PRODUCT_ID;
    this.purchaseType = 'buy';
    this.product = null;

    this.init();
  }

  async init() {
    await this.loadProductData();
    this.bindEvents();
  }

  async loadProductData() {
    try {
      const response = await fetch(`/api/product/${this.productId}`);
      const data = await response.json();
      this.product = data;
      this.renderProduct();
    } catch (error) {
      console.error('제품 정보 로드 실패:', error);
    }
  }

  renderProduct() {
    const p = this.product;

    document.getElementById('main-product-image').src = p.thumbnail;
    document.getElementById('product-name').textContent = p.name;
    document.getElementById('buy-price').textContent = this.formatPrice(p.buy_price);
    document.getElementById('rent-price').textContent = this.formatPrice(p.rent_price);
    document.getElementById('representative-image').src = p.main_image || p.thumbnail;
    document.getElementById('product-description').textContent = p.description;

    // 옵션 렌더링 (반지만 13호, 18호 옵션 표시)
    const optionsSection = document.querySelector('.options-section');
    const optionsSelect = document.getElementById('product-options');
    if (p.category === 'ring') {
      optionsSection.style.display = 'block';
      optionsSelect.innerHTML = '<option value="">옵션을 선택하세요</option>' +
        '<option value="13호">13호</option>' +
        '<option value="18호">18호</option>';
    } else {
      optionsSection.style.display = 'none';
    }

    // 디테일 이미지
    this.renderImages('detail-images', p.detail_images);

    // 착용샷 이미지
    this.renderImages('wearing-shots', p.wearing_shots);
  }

  renderImages(containerId, images) {
    const container = document.getElementById(containerId);
    if (images && images.length > 0) {
      container.innerHTML = images.map(img =>
        `<img src="${img}" alt="상품 이미지">`
      ).join('');
    }
  }

  bindEvents() {
    // 구매/대여 토글
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.purchaseType = btn.dataset.type;
      });
    });

    // 구매하기 버튼
    document.getElementById('buy-now-btn').addEventListener('click', () => {
      this.buyNow();
    });

    // 장바구니 버튼
    document.getElementById('add-cart-btn').addEventListener('click', () => {
      this.addToCart();
    });
  }

  formatPrice(price) {
    return '₩' + (price || 0).toLocaleString('ko-KR');
  }

  buyNow() {
    const option = document.getElementById('product-options').value;
    // 반지일 경우에만 옵션 필수
    if (this.product.category === 'ring' && !option) {
      alert('옵션을 선택해주세요.');
      return;
    }
    const optionText = option ? ` (${option})` : '';
    alert(`${this.purchaseType === 'buy' ? '구매' : '대여'} 진행: ${this.product.name}${optionText}`);
    // 실제 구매 로직 구현
  }

  addToCart() {
    const option = document.getElementById('product-options').value;
    // 반지일 경우에만 옵션 필수
    if (this.product.category === 'ring' && !option) {
      alert('옵션을 선택해주세요.');
      return;
    }
    alert('장바구니에 추가되었습니다.');
    // 실제 장바구니 로직 구현
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductDetail();
});
