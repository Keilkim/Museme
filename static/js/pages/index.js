/*
 * MUZ:ME Shopping Mall - Index Page Scripts
 * 메인 랜딩 페이지 스크립트
 */

/**
 * BannerSlider 클래스
 * 배너 이미지 슬라이더 기능을 제공합니다.
 */
class BannerSlider {
  /**
   * BannerSlider 생성자
   * @param {HTMLElement} container - 슬라이더 컨테이너 요소
   */
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.banner-slide');
    this.prevBtn = container.querySelector('.prev-banner');
    this.nextBtn = container.querySelector('.next-banner');
    this.numbering = container.querySelector('.banner-numbering');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;

    this.init();
  }

  /**
   * 슬라이더 초기화
   */
  init() {
    if (this.slides.length === 0) {
      console.warn('BannerSlider: No slides found');
      return;
    }

    this.bindEvents();
    this.updateNumbering();
    this.autoPlay(this.autoPlayDelay);
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 이전/다음 버튼 클릭
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // 호버 시 자동 재생 멈춤
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.autoPlay(this.autoPlayDelay));

    // 터치 스와이프 지원
    this.bindTouchEvents();

    // 키보드 접근성
    this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  /**
   * 터치 이벤트 바인딩 (모바일 스와이프)
   */
  bindTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      this.stopAutoPlay();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }

      this.autoPlay(this.autoPlayDelay);
    }, { passive: true });
  }

  /**
   * 키보드 이벤트 처리
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  handleKeydown(e) {
    if (e.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (e.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  /**
   * 특정 슬라이드로 이동
   * @param {number} index - 이동할 슬라이드 인덱스
   */
  goToSlide(index) {
    // 현재 슬라이드 비활성화
    this.slides[this.currentIndex].classList.remove('active');

    // 인덱스 순환 처리
    this.currentIndex = (index + this.slides.length) % this.slides.length;

    // 새 슬라이드 활성화
    this.slides[this.currentIndex].classList.add('active');

    // 번호 업데이트
    this.updateNumbering();
  }

  /**
   * 다음 슬라이드로 이동
   */
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  /**
   * 이전 슬라이드로 이동
   */
  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  /**
   * 슬라이드 번호 표시 업데이트
   */
  updateNumbering() {
    if (this.numbering) {
      this.numbering.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
  }

  /**
   * 자동 재생 시작
   * @param {number} interval - 재생 간격 (밀리초)
   */
  autoPlay(interval) {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.nextSlide(), interval);
  }

  /**
   * 자동 재생 중지
   */
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  /**
   * 슬라이더 파괴 (정리)
   */
  destroy() {
    this.stopAutoPlay();
    // 추가적인 정리 작업이 필요하면 여기에 추가
  }
}

/**
 * 카테고리 아이템 호버 효과
 */
function initCategoryHoverEffects() {
  const categoryItems = document.querySelectorAll('.category-item');

  categoryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-4px)';
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
    });
  });
}

/**
 * 부드러운 스크롤 (테마 섹션 네비게이션용)
 * @param {string} targetId - 스크롤할 대상 요소 ID
 */
function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * 스크롤 애니메이션 (Intersection Observer)
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 테마 갤러리 섹션 관찰
  const themeGalleries = document.querySelectorAll('.theme-gallery');
  themeGalleries.forEach(gallery => {
    observer.observe(gallery);
  });
}

/**
 * 페이지 초기화
 */
function initIndexPage() {
  // 배너 슬라이더 초기화
  const bannerGallery = document.querySelector('.banner-gallery');
  if (bannerGallery) {
    window.bannerSlider = new BannerSlider(bannerGallery);
  }

  // 카테고리 호버 효과 초기화
  initCategoryHoverEffects();

  // 스크롤 애니메이션 초기화
  initScrollAnimations();
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', initIndexPage);

// 모듈 내보내기 (필요 시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BannerSlider,
    initIndexPage,
    scrollToSection
  };
}
