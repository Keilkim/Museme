/**
 * MUZ:ME Header Manager
 * 헤더 컴포넌트의 상호작용을 관리하는 클래스
 */
class HeaderManager {
  constructor() {
    // DOM 요소 참조
    this.authBtn = document.getElementById('auth-btn');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.tabMenu = document.querySelector('.tab-menu');
    this.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // 상태
    this.isMobileMenuOpen = false;

    // 초기화
    this.init();
  }

  /**
   * 초기화 메서드
   */
  init() {
    this.bindEvents();
    this.updateAuthUI();
    this.setActiveTab();
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 로그인/로그아웃 버튼 클릭
    if (this.authBtn) {
      this.authBtn.addEventListener('click', () => this.handleAuthClick());
    }

    // 모바일 메뉴 토글
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // 모바일 메뉴 항목 클릭 시 메뉴 닫기
    this.mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        if (this.isMobileMenuOpen) {
          this.toggleMobileMenu();
        }
      });
    });

    // ESC 키로 모바일 메뉴 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    });

    // 윈도우 리사이즈 시 모바일 메뉴 닫기
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    });

    // 오버레이 외부 클릭 시 메뉴 닫기
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === this.mobileMenuOverlay) {
          this.toggleMobileMenu();
        }
      });
    }
  }

  /**
   * 로그인 상태에 따라 버튼 UI 업데이트
   */
  updateAuthUI() {
    if (!this.authBtn) return;

    const isLoggedIn = this.checkLoginStatus();
    this.authBtn.textContent = isLoggedIn ? '로그아웃' : '로그인';
    this.authBtn.setAttribute('data-logged-in', isLoggedIn);
  }

  /**
   * 로그인 상태 확인
   * @returns {boolean}
   */
  checkLoginStatus() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
  }

  /**
   * 인증 버튼 클릭 핸들러
   */
  handleAuthClick() {
    const isLoggedIn = this.checkLoginStatus();

    if (isLoggedIn) {
      this.logout();
    } else {
      this.openLoginModal();
    }
  }

  /**
   * 로그아웃 처리
   */
  logout() {
    // 토큰 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // UI 업데이트
    this.updateAuthUI();

    // 커스텀 이벤트 발생
    const logoutEvent = new CustomEvent('userLogout', {
      detail: { timestamp: new Date() }
    });
    document.dispatchEvent(logoutEvent);

    // 홈으로 리다이렉트 (선택사항)
    // window.location.href = '/';
  }

  /**
   * 로그인 모달 열기
   */
  openLoginModal() {
    // authManager가 있으면 사용
    if (window.authManager) {
      window.authManager.openModal('login');
    } else {
      // 커스텀 이벤트 발생 (다른 컴포넌트에서 처리)
      const loginEvent = new CustomEvent('openLoginModal', {
        detail: { source: 'header' }
      });
      document.dispatchEvent(loginEvent);
    }
  }

  /**
   * 현재 URL에 따라 활성 탭 설정
   */
  setActiveTab() {
    const currentPath = window.location.pathname;

    // 데스크톱 탭 메뉴
    this.tabBtns.forEach(btn => {
      const href = btn.getAttribute('href');
      if (href && currentPath.includes(href)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 모바일 네비게이션
    this.mobileNavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.includes(href)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * 모바일 메뉴 토글
   */
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // 햄버거 버튼 애니메이션
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.classList.toggle('active', this.isMobileMenuOpen);
    }

    // 오버레이 표시/숨김
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.classList.toggle('active', this.isMobileMenuOpen);
    }

    // body 스크롤 제어
    document.body.classList.toggle('menu-open', this.isMobileMenuOpen);

    // 접근성: 포커스 관리
    if (this.isMobileMenuOpen) {
      const firstNavItem = this.mobileMenuOverlay?.querySelector('.mobile-nav-item');
      if (firstNavItem) {
        firstNavItem.focus();
      }
    } else {
      this.mobileMenuBtn?.focus();
    }
  }

  /**
   * 특정 테마 탭으로 이동
   * @param {string} theme - 테마 이름
   */
  navigateToTheme(theme) {
    const validThemes = ['traditional', 'daily', 'party', 'princess', 'idol', 'country'];

    if (validThemes.includes(theme)) {
      window.location.href = `/products/${theme}`;
    }
  }

  /**
   * 외부에서 로그인 상태 업데이트 (예: 로그인 성공 후 호출)
   * @param {string} token - 인증 토큰
   * @param {object} userData - 사용자 데이터
   */
  setLoggedIn(token, userData = {}) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.updateAuthUI();

    // 커스텀 이벤트 발생
    const loginEvent = new CustomEvent('userLogin', {
      detail: { userData, timestamp: new Date() }
    });
    document.dispatchEvent(loginEvent);
  }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 전역 접근을 위해 window 객체에 할당
  window.headerManager = new HeaderManager();
});

// 모듈 내보내기 (ES6 모듈 환경에서 사용 시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderManager;
}
