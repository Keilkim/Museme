/**
 * MUZ:ME Shopping Mall - Utility Functions
 * 공통 유틸리티 함수 모듈
 */

/**
 * 가격 포맷팅 함수
 * @param {number} number - 포맷팅할 숫자
 * @returns {string} 포맷팅된 가격 문자열 (예: ₩1,000,000)
 */
function formatPrice(number) {
  if (number === null || number === undefined) {
    return '₩0';
  }

  const num = Number(number);

  if (isNaN(num)) {
    return '₩0';
  }

  return '₩' + num.toLocaleString('ko-KR');
}

/**
 * Debounce 함수
 * 연속적인 함수 호출을 지연시켜 마지막 호출만 실행
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} debounce가 적용된 함수
 */
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * Throttle 함수
 * 함수 호출을 일정 시간 간격으로 제한
 * @param {Function} fn - 실행할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {Function} throttle이 적용된 함수
 */
function throttle(fn, limit) {
  let inThrottle;
  let lastFunc;
  let lastRan;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      fn.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * 날짜 포맷팅 함수
 * @param {Date|string} date - 포맷팅할 날짜
 * @param {string} format - 포맷 문자열 (기본: 'YYYY-MM-DD')
 * @returns {string} 포맷팅된 날짜 문자열
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 로컬 스토리지 헬퍼 함수들
 */
const storage = {
  /**
   * 로컬 스토리지에 데이터 저장
   * @param {string} key - 키
   * @param {*} value - 저장할 값
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  /**
   * 로컬 스토리지에서 데이터 가져오기
   * @param {string} key - 키
   * @param {*} defaultValue - 기본값
   * @returns {*} 저장된 값 또는 기본값
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  /**
   * 로컬 스토리지에서 데이터 삭제
   * @param {string} key - 삭제할 키
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  /**
   * 로컬 스토리지 전체 삭제
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  }
};

/**
 * 쿼리 문자열 파싱
 * @param {string} queryString - 파싱할 쿼리 문자열
 * @returns {Object} 파싱된 객체
 */
function parseQueryString(queryString = window.location.search) {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

/**
 * 객체를 쿼리 문자열로 변환
 * @param {Object} obj - 변환할 객체
 * @returns {string} 쿼리 문자열
 */
function toQueryString(obj) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  }

  return params.toString();
}

/**
 * 요소 클래스 토글
 * @param {HTMLElement} element - 대상 요소
 * @param {string} className - 토글할 클래스명
 */
function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * 스크롤 애니메이션
 * @param {HTMLElement|string} target - 스크롤 대상 요소 또는 선택자
 * @param {number} offset - 상단 오프셋 (픽셀)
 */
function scrollToElement(target, offset = 0) {
  const element = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  }
}

// 모듈 내보내기 (ES6 모듈이 지원되지 않는 환경을 위해 전역 객체에도 할당)
if (typeof window !== 'undefined') {
  window.MusemeUtils = {
    formatPrice,
    debounce,
    throttle,
    formatDate,
    storage,
    parseQueryString,
    toQueryString,
    toggleClass,
    scrollToElement
  };
}
