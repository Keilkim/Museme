/**
 * MUZ:ME Auth Manager
 * 로그인/회원가입 모달 관리
 */
class AuthManager {
  constructor() {
    this.modal = document.getElementById('auth-modal');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.tabs = document.querySelectorAll('.auth-tab');
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');

    if (this.modal) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // 모달 닫기
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.closeModal();
      }
    });

    // 탭 전환
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // 폼 제출
    this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    this.signupForm?.addEventListener('submit', (e) => this.handleSignup(e));
  }

  openModal(tab = 'login') {
    this.modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.switchTab(tab);
  }

  closeModal() {
    this.modal?.classList.remove('active');
    document.body.style.overflow = '';
    this.clearErrors();
  }

  switchTab(tabName) {
    // 탭 버튼 활성화
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // 폼 전환
    if (tabName === 'login') {
      this.loginForm?.classList.add('active');
      this.signupForm?.classList.remove('active');
    } else {
      this.loginForm?.classList.remove('active');
      this.signupForm?.classList.add('active');
    }

    this.clearErrors();
  }

  clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => {
      el.textContent = '';
    });
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // 로그인 처리
  async handleLogin(e) {
    e.preventDefault();
    this.clearErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');

    // 유효성 검사
    if (!this.validateEmail(email)) {
      emailError.textContent = '올바른 이메일 형식이 아닙니다.';
      return;
    }

    if (password.length < 6) {
      passwordError.textContent = '비밀번호는 6자 이상이어야 합니다.';
      return;
    }

    try {
      const hashedPassword = await this.hashPassword(password);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        passwordError.textContent = data.error || '로그인에 실패했습니다.';
        return;
      }

      // 로그인 성공
      this.storeSession(data.token, data.user);
      this.closeModal();
      window.location.reload();
    } catch (error) {
      console.error('로그인 실패:', error);
      passwordError.textContent = '로그인에 실패했습니다.';
    }
  }

  // 회원가입 처리
  async handleSignup(e) {
    e.preventDefault();
    this.clearErrors();

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    const emailError = document.getElementById('signup-email-error');
    const passwordError = document.getElementById('signup-password-error');
    const passwordConfirmError = document.getElementById('signup-password-confirm-error');

    // 유효성 검사
    if (!this.validateEmail(email)) {
      emailError.textContent = '올바른 이메일 형식이 아닙니다.';
      return;
    }

    if (password.length < 6) {
      passwordError.textContent = '비밀번호는 6자 이상이어야 합니다.';
      return;
    }

    if (password !== passwordConfirm) {
      passwordConfirmError.textContent = '비밀번호가 일치하지 않습니다.';
      return;
    }

    try {
      const hashedPassword = await this.hashPassword(password);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        emailError.textContent = data.error || '회원가입에 실패했습니다.';
        return;
      }

      // 회원가입 성공 - 자동 로그인
      this.storeSession(data.token, data.user);
      this.closeModal();
      window.location.reload();
    } catch (error) {
      console.error('회원가입 실패:', error);
      emailError.textContent = '회원가입에 실패했습니다.';
    }
  }

  storeSession(token, user) {
    localStorage.setItem('authToken', token);
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.reload();
  }

  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  getSessionData() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});
