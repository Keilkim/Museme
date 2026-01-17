/**
 * MUZ:ME Shopping Mall - API Module
 * API 호출 모듈
 */

// API 기본 URL
const BASE_URL = '/api';

/**
 * API 호출 함수
 * @param {string} endpoint - API 엔드포인트 (예: '/products')
 * @param {Object} options - fetch 옵션
 * @param {string} options.method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
 * @param {Object} options.body - 요청 본문 데이터
 * @param {Object} options.headers - 추가 헤더
 * @returns {Promise<Object>} API 응답 데이터
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // GET 요청이 아닌 경우 body 추가
  if (options.body && config.method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // 응답이 성공적이지 않은 경우
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    // 204 No Content의 경우 빈 객체 반환
    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // 네트워크 에러 등
    throw new APIError(
      error.message || '네트워크 오류가 발생했습니다.',
      0,
      { originalError: error }
    );
  }
}

/**
 * API 에러 클래스
 */
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 상품 목록 조회
 * @param {string} theme - 테마 필터 (선택적)
 * @param {string} category - 카테고리 필터 (선택적)
 * @param {Object} additionalParams - 추가 쿼리 파라미터
 * @returns {Promise<Object>} 상품 목록
 */
async function getProducts(theme = null, category = null, additionalParams = {}) {
  const params = new URLSearchParams();

  if (theme) {
    params.append('theme', theme);
  }

  if (category) {
    params.append('category', category);
  }

  // 추가 파라미터 처리
  for (const [key, value] of Object.entries(additionalParams)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  }

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return await fetchAPI(endpoint);
}

/**
 * 상품 상세 조회
 * @param {string|number} id - 상품 ID
 * @returns {Promise<Object>} 상품 상세 정보
 */
async function getProductById(id) {
  if (!id) {
    throw new APIError('상품 ID가 필요합니다.', 400);
  }

  return await fetchAPI(`/products/${id}`);
}

/**
 * 카테고리 목록 조회
 * @returns {Promise<Object>} 카테고리 목록
 */
async function getCategories() {
  return await fetchAPI('/categories');
}

/**
 * 테마 목록 조회
 * @returns {Promise<Object>} 테마 목록
 */
async function getThemes() {
  return await fetchAPI('/themes');
}

/**
 * 장바구니 조회
 * @returns {Promise<Object>} 장바구니 데이터
 */
async function getCart() {
  return await fetchAPI('/cart');
}

/**
 * 장바구니에 상품 추가
 * @param {string|number} productId - 상품 ID
 * @param {number} quantity - 수량
 * @returns {Promise<Object>} 업데이트된 장바구니
 */
async function addToCart(productId, quantity = 1) {
  return await fetchAPI('/cart/items', {
    method: 'POST',
    body: {
      product_id: productId,
      quantity: quantity,
    },
  });
}

/**
 * 장바구니 상품 수량 변경
 * @param {string|number} itemId - 장바구니 아이템 ID
 * @param {number} quantity - 새로운 수량
 * @returns {Promise<Object>} 업데이트된 장바구니
 */
async function updateCartItem(itemId, quantity) {
  return await fetchAPI(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: {
      quantity: quantity,
    },
  });
}

/**
 * 장바구니에서 상품 삭제
 * @param {string|number} itemId - 장바구니 아이템 ID
 * @returns {Promise<Object>} 업데이트된 장바구니
 */
async function removeFromCart(itemId) {
  return await fetchAPI(`/cart/items/${itemId}`, {
    method: 'DELETE',
  });
}

/**
 * 상품 검색
 * @param {string} query - 검색어
 * @param {Object} filters - 추가 필터
 * @returns {Promise<Object>} 검색 결과
 */
async function searchProducts(query, filters = {}) {
  const params = new URLSearchParams();
  params.append('q', query);

  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  }

  return await fetchAPI(`/products/search?${params.toString()}`);
}

// 모듈 내보내기 (ES6 모듈이 지원되지 않는 환경을 위해 전역 객체에도 할당)
if (typeof window !== 'undefined') {
  window.MusemeAPI = {
    BASE_URL,
    fetchAPI,
    APIError,
    getProducts,
    getProductById,
    getCategories,
    getThemes,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchProducts,
  };
}
