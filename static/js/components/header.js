/**
 * MUZ:ME Header Manager
 * 헤더 컴포넌트의 상호작용을 관리하는 클래스
 */
class HeaderManager {
  constructor() {
    // DOM 요소 참조
    this.authBtn = document.getElementById('auth-btn');
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.colorPickerDropdown = document.getElementById('color-picker-dropdown');
    this.accentColorPicker = document.getElementById('accent-color-picker');
    this.colorValue = document.getElementById('color-value');
    this.resetColorBtn = document.getElementById('reset-color-btn');
    this.modeBtns = document.querySelectorAll('.mode-btn');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileDropdown = document.getElementById('mobile-dropdown');
    this.tabMenu = document.querySelector('.tab-menu');
    this.tabBtns = document.querySelectorAll('.tab-btn');

    // 상태
    this.isMobileMenuOpen = false;
    this.isColorPickerOpen = false;
    this.currentAccentColor = localStorage.getItem('accentColor') || '#E85A50';
    this.currentMode = localStorage.getItem('colorMode') || 'light';

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
    // 컬러 테마 비활성화 - 흰색 배경 유지
    // this.applyColorTheme(this.currentAccentColor, this.currentMode);
    this.hideThemeBtnOnDate();
    // this.updateColorPickerUI();
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 로그인/로그아웃 버튼 클릭
    if (this.authBtn) {
      this.authBtn.addEventListener('click', () => this.handleAuthClick());
    }

    // 컬러 피커 토글 버튼 클릭
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleColorPicker();
      });
    }

    // 컬러 피커 색상 변경
    if (this.accentColorPicker) {
      this.accentColorPicker.addEventListener('input', (e) => {
        this.currentAccentColor = e.target.value;
        this.colorValue.textContent = e.target.value.toUpperCase();
        this.applyColorTheme(this.currentAccentColor, this.currentMode);
        localStorage.setItem('accentColor', this.currentAccentColor);
      });
    }

    // 초기화 버튼 클릭
    if (this.resetColorBtn) {
      this.resetColorBtn.addEventListener('click', () => {
        this.currentAccentColor = '#E85A50';
        this.currentMode = 'light';
        localStorage.setItem('accentColor', this.currentAccentColor);
        localStorage.setItem('colorMode', this.currentMode);
        this.applyColorTheme(this.currentAccentColor, this.currentMode);
        this.updateColorPickerUI();
      });
    }

    // 라이트/다크 모드 토글
    this.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentMode = btn.getAttribute('data-mode');
        localStorage.setItem('colorMode', this.currentMode);
        this.applyColorTheme(this.currentAccentColor, this.currentMode);
        this.updateModeBtnUI();
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
      if (!e.target.closest('.color-picker-dropdown') && !e.target.closest('#theme-toggle-btn')) {
        this.closeColorPicker();
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
   * 컬러 피커 토글
   */
  toggleColorPicker() {
    this.isColorPickerOpen = !this.isColorPickerOpen;
    if (this.colorPickerDropdown) {
      this.colorPickerDropdown.classList.toggle('active', this.isColorPickerOpen);
    }
    // 다른 드롭다운 닫기
    this.closeMobileDropdown();
  }

  /**
   * 컬러 피커 닫기
   */
  closeColorPicker() {
    this.isColorPickerOpen = false;
    if (this.colorPickerDropdown) {
      this.colorPickerDropdown.classList.remove('active');
    }
  }

  /**
   * 컬러 피커 UI 업데이트
   */
  updateColorPickerUI() {
    if (this.accentColorPicker) {
      this.accentColorPicker.value = this.currentAccentColor;
    }
    if (this.colorValue) {
      this.colorValue.textContent = this.currentAccentColor.toUpperCase();
    }
    this.updateModeBtnUI();
  }

  /**
   * 모드 버튼 UI 업데이트
   */
  updateModeBtnUI() {
    this.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === this.currentMode);
    });
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
    this.closeColorPicker();
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
    this.closeColorPicker();
    this.closeMobileDropdown();
  }

  /**
   * Hex 색상을 RGB로 변환
   * @param {string} hex - Hex 색상 (#RRGGBB)
   * @returns {object} {r, g, b}
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 232, g: 90, b: 80 };
  }

  /**
   * RGB를 Hex로 변환
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {string}
   */
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * RGB를 HSL로 변환
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {object} {h, s, l}
   */
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * HSL을 RGB로 변환
   * @param {number} h (0-360)
   * @param {number} s (0-100)
   * @param {number} l (0-100)
   * @returns {object} {r, g, b}
   */
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  /**
   * 선택한 색상과 모드로 테마 적용
   * @param {string} accentHex - 액센트 색상 (hex)
   * @param {string} mode - 'light' 또는 'dark'
   */
  applyColorTheme(accentHex, mode) {
    const root = document.documentElement;
    const accent = this.hexToRgb(accentHex);
    const accentHsl = this.rgbToHsl(accent.r, accent.g, accent.b);

    // 극단 색상 처리 (흰색/검정색 근처에서 hue가 불안정해지는 것 방지)
    // 채도가 매우 낮거나 명도가 극단일 때 무채색 처리
    const isNeutral = accentHsl.s < 10 || accentHsl.l < 5 || accentHsl.l > 95;
    const safeHue = accentHsl.h; // hue는 그대로 유지

    // 원본 색상의 채도를 기반으로 배경 채도 결정
    // 무채색일 때는 채도 0, 아니면 최소 8%, 최대 35%
    const baseSaturation = isNeutral ? 0 : Math.min(35, Math.max(8, accentHsl.s * 0.4));

    // 어두운 accent 색상 생성
    const accentDarkHsl = { h: safeHue, s: accentHsl.s, l: Math.max(0, accentHsl.l - 10) };
    const accentDarkRgb = this.hslToRgb(accentDarkHsl.h, accentDarkHsl.s, accentDarkHsl.l);
    const accentDarkHex = this.rgbToHex(accentDarkRgb.r, accentDarkRgb.g, accentDarkRgb.b);

    // 선택한 색상의 명도에 따라 배경 명도 계산
    // 명도 0~100% → 배경 명도 15~95% 범위로 매핑
    const accentLightness = accentHsl.l;
    const bgBaseLightness = 15 + (accentLightness / 100) * 80; // 15% ~ 95%

    // 다크 모드일 때 명도를 더 낮춤
    const isDarkMode = mode === 'dark';
    const modeOffset = isDarkMode ? -30 : 0;
    const bgLightness = Math.max(8, Math.min(95, bgBaseLightness + modeOffset));

    // 배경이 어두운지 밝은지 판단 (50% 기준)
    const isBackgroundDark = bgLightness < 50;

    let t;
    if (isBackgroundDark) {
      // 어두운 배경 테마
      const darkSaturation = Math.min(25, Math.max(8, baseSaturation * 0.8));
      const bgHsl = { h: safeHue, s: darkSaturation, l: bgLightness };
      const bgRgb = this.hslToRgb(bgHsl.h, bgHsl.s, bgHsl.l);
      const surfaceHiHsl = { h: safeHue, s: darkSaturation, l: Math.min(95, bgLightness + 10) };
      const surfaceHiRgb = this.hslToRgb(surfaceHiHsl.h, surfaceHiHsl.s, surfaceHiHsl.l);
      const surfaceLoHsl = { h: safeHue, s: darkSaturation, l: Math.max(5, bgLightness - 8) };
      const surfaceLoRgb = this.hslToRgb(surfaceLoHsl.h, surfaceLoHsl.s, surfaceLoHsl.l);
      // 쉐도우 하이라이트용 - 배경보다 밝게 (뉴모피즘 효과용)
      const shadowLightHsl = { h: safeHue, s: darkSaturation * 0.8, l: Math.min(95, bgLightness + 18) };
      const shadowLightRgb = this.hslToRgb(shadowLightHsl.h, shadowLightHsl.s, shadowLightHsl.l);

      t = {
        bg: this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
        bgRgb: `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`,
        surfaceHi: this.rgbToHex(surfaceHiRgb.r, surfaceHiRgb.g, surfaceHiRgb.b),
        surfaceLo: this.rgbToHex(surfaceLoRgb.r, surfaceLoRgb.g, surfaceLoRgb.b),
        surface: this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
        text: '#E5E5E5',
        textRgb: '229, 229, 229',
        muted: '#888888',
        mutedRgb: '136, 136, 136',
        accent: accentHex,
        accentDark: accentDarkHex,
        accentRgb: `${accent.r}, ${accent.g}, ${accent.b}`,
        shadowDarkRgb: '0, 0, 0',
        shadowLightRgb: `${shadowLightRgb.r}, ${shadowLightRgb.g}, ${shadowLightRgb.b}`,
        whiteRgb: `${shadowLightRgb.r}, ${shadowLightRgb.g}, ${shadowLightRgb.b}`,
        blackRgb: '0, 0, 0',
        overlay: 'rgba(0, 0, 0, 0.6)',
        hoverBg: 'rgba(255, 255, 255, 0.08)'
      };
    } else {
      // 밝은 배경 테마
      const lightSaturation = Math.min(45, Math.max(15, baseSaturation));
      const bgHsl = { h: safeHue, s: lightSaturation, l: bgLightness };
      const bgRgb = this.hslToRgb(bgHsl.h, bgHsl.s, bgHsl.l);
      const surfaceLoHsl = { h: safeHue, s: lightSaturation * 0.8, l: Math.max(30, bgLightness - 8) };
      const surfaceLoRgb = this.hslToRgb(surfaceLoHsl.h, surfaceLoHsl.s, surfaceLoHsl.l);
      const shadowDarkHsl = { h: safeHue, s: lightSaturation * 0.6, l: Math.max(20, bgLightness - 25) };
      const shadowDarkRgb = this.hslToRgb(shadowDarkHsl.h, shadowDarkHsl.s, shadowDarkHsl.l);

      t = {
        bg: this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
        bgRgb: `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`,
        surfaceHi: '#FFFFFF',
        surfaceLo: this.rgbToHex(surfaceLoRgb.r, surfaceLoRgb.g, surfaceLoRgb.b),
        surface: this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
        text: '#1E1E1E',
        textRgb: '30, 30, 30',
        muted: '#6B6B6B',
        mutedRgb: '107, 107, 107',
        accent: accentHex,
        accentDark: accentDarkHex,
        accentRgb: `${accent.r}, ${accent.g}, ${accent.b}`,
        shadowDarkRgb: `${shadowDarkRgb.r}, ${shadowDarkRgb.g}, ${shadowDarkRgb.b}`,
        shadowLightRgb: '255, 255, 255',
        whiteRgb: '255, 255, 255',
        blackRgb: '0, 0, 0',
        overlay: 'rgba(0, 0, 0, 0.4)',
        hoverBg: 'rgba(0, 0, 0, 0.05)'
      };
    }

    // 기본 색상
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--bg-rgb', t.bgRgb);
    root.style.setProperty('--surface', t.surface);
    root.style.setProperty('--surface-hi', t.surfaceHi);
    root.style.setProperty('--surface-lo', t.surfaceLo);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--text-rgb', t.textRgb);
    root.style.setProperty('--muted', t.muted);
    root.style.setProperty('--muted-rgb', t.mutedRgb);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-dark', t.accentDark);
    root.style.setProperty('--accent-rgb', t.accentRgb);

    // RGB 값 (alpha 조합용)
    root.style.setProperty('--shadow-dark-rgb', t.shadowDarkRgb);
    root.style.setProperty('--shadow-light-rgb', t.shadowLightRgb);
    root.style.setProperty('--white-rgb', t.whiteRgb);
    root.style.setProperty('--black-rgb', t.blackRgb);

    // 기능별 색상
    root.style.setProperty('--overlay', t.overlay);
    root.style.setProperty('--hover-bg', t.hoverBg);

    // 그림자 업데이트
    root.style.setProperty('--shadow-out',
      `10px 10px 20px rgba(${t.shadowDarkRgb}, .6), -10px -10px 20px rgba(${t.shadowLightRgb}, 1)`);
    root.style.setProperty('--shadow-out-soft',
      `6px 6px 14px rgba(${t.shadowDarkRgb}, .5), -6px -6px 14px rgba(${t.shadowLightRgb}, 1)`);
    root.style.setProperty('--shadow-in',
      `inset 5px 5px 10px rgba(${t.shadowDarkRgb}, .5), inset -5px -5px 10px rgba(${t.shadowLightRgb}, .85)`);
    root.style.setProperty('--shadow-hover',
      `14px 14px 28px rgba(${t.shadowDarkRgb}, .65), -14px -14px 28px rgba(${t.shadowLightRgb}, 1)`);
    root.style.setProperty('--shadow-pressed',
      `inset 7px 7px 14px rgba(${t.shadowDarkRgb}, .55), inset -7px -7px 14px rgba(${t.shadowLightRgb}, .8)`);
    root.style.setProperty('--ring', `0 0 0 3px rgba(${t.accentRgb}, .22)`);
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
