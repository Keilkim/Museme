/**
 * Footer Component Manager
 * MUZ:ME Shopping Mall
 *
 * 푸터 컴포넌트의 동적 기능을 관리합니다.
 * - 저작권 연도 자동 업데이트
 */

class FooterManager {
  constructor() {
    this.copyrightElement = null;
    this.init();
  }

  /**
   * 초기화
   */
  init() {
    this.copyrightElement = document.querySelector('.copyright');
    this.updateCopyrightYear();
  }

  /**
   * 저작권 연도 자동 업데이트
   * 현재 연도를 자동으로 반영합니다.
   */
  updateCopyrightYear() {
    if (this.copyrightElement) {
      const year = new Date().getFullYear();
      this.copyrightElement.textContent = `COPYRIGHT © ${year} MUZ:ME. All rights reserved.`;
    }
  }
}

// DOM 로드 완료 후 FooterManager 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
  window.footerManager = new FooterManager();
});
