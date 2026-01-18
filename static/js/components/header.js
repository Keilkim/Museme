/**
 * MUZ:ME Header Manager
 * 헤더 컴포넌트의 상호작용을 관리하는 클래스
 */
class HeaderManager {
  constructor() {
    // DOM 요소 참조
    this.authBtn = document.getElementById('auth-btn');
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeDropdown = document.getElementById('theme-dropdown');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileDropdown = document.getElementById('mobile-dropdown');
    this.tabMenu = document.querySelector('.tab-menu');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.themeOptions = document.querySelectorAll('.theme-option');

    // 상태
    this.isMobileMenuOpen = false;
    this.isThemeDropdownOpen = false;
    this.currentTheme = localStorage.getItem('siteTheme') || 'default';

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
    this.applyTheme(this.currentTheme);
    this.hideThemeBtnOnDate();
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 로그인/로그아웃 버튼 클릭
    if (this.authBtn) {
      this.authBtn.addEventListener('click', () => this.handleAuthClick());
    }

    // 테마 토글 버튼 클릭
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleThemeDropdown();
      });
    }

    // 테마 옵션 클릭
    this.themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        this.applyTheme(theme);
        this.closeAllDropdowns();
      });
    });

    // 모바일 메뉴 버튼 클릭
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileDropdown();
      });
    }

    // ESC 키로 드롭다운 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });

    // 문서 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-dropdown') && !e.target.closest('#theme-toggle-btn')) {
        this.closeThemeDropdown();
      }
      if (!e.target.closest('.mobile-dropdown') && !e.target.closest('#mobile-menu-btn')) {
        this.closeMobileDropdown();
      }
    });

    // 윈도우 리사이즈 시 드롭다운 닫기
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileDropdown();
      }
    });
  }

  /**
   * 1월 20일에 테마 버튼 숨기기
   */
  hideThemeBtnOnDate() {
    const today = new Date();
    const month = today.getMonth() + 1; // 0-indexed
    const day = today.getDate();

    // 1월 20일에 숨김
    if (month === 1 && day === 20) {
      if (this.themeToggleBtn) {
        this.themeToggleBtn.style.display = 'none';
      }
    }
  }

  /**
   * 테마 드롭다운 토글
   */
  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
    if (this.themeDropdown) {
      this.themeDropdown.classList.toggle('active', this.isThemeDropdownOpen);
    }
    // 다른 드롭다운 닫기
    this.closeMobileDropdown();
  }

  /**
   * 테마 드롭다운 닫기
   */
  closeThemeDropdown() {
    this.isThemeDropdownOpen = false;
    if (this.themeDropdown) {
      this.themeDropdown.classList.remove('active');
    }
  }

  /**
   * 모바일 드롭다운 토글
   */
  toggleMobileDropdown() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.mobileDropdown) {
      this.mobileDropdown.classList.toggle('active', this.isMobileMenuOpen);
    }
    // 다른 드롭다운 닫기
    this.closeThemeDropdown();
  }

  /**
   * 모바일 드롭다운 닫기
   */
  closeMobileDropdown() {
    this.isMobileMenuOpen = false;
    if (this.mobileDropdown) {
      this.mobileDropdown.classList.remove('active');
    }
  }

  /**
   * 모든 드롭다운 닫기
   */
  closeAllDropdowns() {
    this.closeThemeDropdown();
    this.closeMobileDropdown();
  }

  /**
   * 테마 적용
   * @param {string} theme - 테마 이름
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('siteTheme', theme);

    // 활성 테마 옵션 업데이트
    this.themeOptions.forEach(option => {
      option.classList.toggle('active', option.getAttribute('data-theme') === theme);
    });

    // CSS 변수로 테마 적용
    const root = document.documentElement;

    switch (theme) {
      case 'gold':
        root.style.setProperty('--bg', '#F5F0E6');
        root.style.setProperty('--surface-high', '#FFFFFF');
        root.style.setProperty('--surface-low', '#E8DFC8');
        root.style.setProperty('--accent', '#C9A961');
        root.style.setProperty('--shadow-out', '10px 10px 20px rgba(180, 160, 120, .5), -10px -10px 20px rgba(255, 255, 255, 1)');
        break;
      case 'rosegold':
        root.style.setProperty('--bg', '#F5EBE8');
        root.style.setProperty('--surface-high', '#FFFFFF');
        root.style.setProperty('--surface-low', '#E8D5D0');
        root.style.setProperty('--accent', '#B76E79');
        root.style.setProperty('--shadow-out', '10px 10px 20px rgba(180, 150, 150, .5), -10px -10px 20px rgba(255, 255, 255, 1)');
        break;
      case 'dark':
        root.style.setProperty('--bg', '#1E1E1E');
        root.style.setProperty('--surface-high', '#2D2D2D');
        root.style.setProperty('--surface-low', '#141414');
        root.style.setProperty('--text', '#E5E5E5');
        root.style.setProperty('--muted', '#888888');
        root.style.setProperty('--accent', '#E85A50');
        root.style.setProperty('--shadow-out', '10px 10px 20px rgba(0, 0, 0, .6), -10px -10px 20px rgba(60, 60, 60, .3)');
        break;
      default: // Silver (default)
        root.style.setProperty('--bg', '#E4EBF5');
        root.style.setProperty('--surface-high', '#FFFFFF');
        root.style.setProperty('--surface-low', '#C8D0E7');
        root.style.setProperty('--text', '#1E1E1E');
        root.style.setProperty('--muted', '#6B6B6B');
        root.style.setProperty('--accent', '#E85A50');
        root.style.setProperty('--shadow-out', '10px 10px 20px rgba(163, 177, 198, .6), -10px -10px 20px rgba(255, 255, 255, 1)');
        break;
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.updateAuthUI();

    const logoutEvent = new CustomEvent('userLogout', {
      detail: { timestamp: new Date() }
    });
    document.dispatchEvent(logoutEvent);
  }

  /**
   * 로그인 모달 열기
   */
  openLoginModal() {
    if (window.authManager) {
      window.authManager.openModal('login');
    } else {
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

    this.tabBtns.forEach(btn => {
      const href = btn.getAttribute('href');
      if (href && currentPath.includes(href)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
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
   * 외부에서 로그인 상태 업데이트
   * @param {string} token - 인증 토큰
   * @param {object} userData - 사용자 데이터
   */
  setLoggedIn(token, userData = {}) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.updateAuthUI();

    const loginEvent = new CustomEvent('userLogin', {
      detail: { userData, timestamp: new Date() }
    });
    document.dispatchEvent(loginEvent);
  }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.headerManager = new HeaderManager();
});

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderManager;
}
