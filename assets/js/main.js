/**
 * PPTQ Jamal Yusuf Al-Haddad - Main Interactive Logic
 * Mobile-First, Performance-Driven, Zero External Libraries
 */

// 1. Centralized PSB Configuration Object
const PSB = {
  tahunAjaran: "2027/2028",
  linkFormulir: "https://forms.gle/mSdwF1ryhwFZVzjF6",
  waIbnu: "6282258588514",
  waAndri: "6281373145426",
  gelombang1: {
    nama: "Gelombang I",
    mulai: "2026-11-01",
    selesai: "2027-01-31",
    display: "1 Nov 2026 – 31 Jan 2027"
  },
  gelombang2: {
    nama: "Gelombang II",
    mulai: "2027-02-01",
    selesai: "2027-06-30",
    display: "1 Feb – 30 Jun 2027"
  },
  biayaAwal: 8850000
};

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initPSBStatus();
  initMobileDrawer();
  initStickyBottomBar();
  initBrochureLightbox();
  initScrollAnimations();
});

function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 2. Calculate & Apply Dynamic PSB Status Badges
 */
function initPSBStatus() {
  const now = new Date();
  
  function getStatus(mulaiStr, selesaiStr) {
    const mulai = new Date(mulaiStr);
    const selesai = new Date(selesaiStr);
    selesai.setHours(23, 59, 59, 999);

    if (now < mulai) {
      return { text: "Akan Datang", className: "upcoming" };
    } else if (now >= mulai && now <= selesai) {
      return { text: "🟢 Sedang Dibuka", className: "active" };
    } else {
      return { text: "Ditutup", className: "closed" };
    }
  }

  const statusG1 = getStatus(PSB.gelombang1.mulai, PSB.gelombang1.selesai);
  const statusG2 = getStatus(PSB.gelombang2.mulai, PSB.gelombang2.selesai);

  // Apply to elements
  const badgeG1 = document.getElementById('badgeGelombang1');
  if (badgeG1) {
    badgeG1.textContent = statusG1.text;
    badgeG1.className = `period-badge ${statusG1.className}`;
  }

  const badgeG2 = document.getElementById('badgeGelombang2');
  if (badgeG2) {
    badgeG2.textContent = statusG2.text;
    badgeG2.className = `period-badge ${statusG2.className}`;
  }

  // Update hero floating card text
  const heroCardVal = document.getElementById('heroCardVal');
  if (heroCardVal) {
    if (statusG1.className === 'active') {
      heroCardVal.textContent = `${PSB.gelombang1.nama}: Dibuka`;
    } else if (statusG2.className === 'active') {
      heroCardVal.textContent = `${PSB.gelombang2.nama}: Dibuka`;
    } else if (now < new Date(PSB.gelombang1.mulai)) {
      heroCardVal.textContent = `Buka: 1 Nov 2026`;
    } else {
      heroCardVal.textContent = `Pendaftaran Dibuka`;
    }
  }
}

/**
 * 3. Mobile Fullscreen Hamburger Drawer Menu
 */
function initMobileDrawer() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-drawer .btn');

  if (!menuToggle || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Tutup menu');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('active');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  // Close when clicking any nav link
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/**
 * 4. Sticky Bottom Bar for Mobile (Shows After Scrolling Past Hero)
 */
function initStickyBottomBar() {
  const heroSection = document.getElementById('home');
  const bottomBar = document.getElementById('mobileBottomBar');

  if (!heroSection || !bottomBar) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If hero is NOT intersecting (scrolled down past hero), show the bottom bar
      if (!entry.isIntersecting) {
        bottomBar.classList.add('visible');
      } else {
        bottomBar.classList.remove('visible');
      }
    });
  }, { threshold: 0.15 });

  observer.observe(heroSection);
}

/**
 * 5. Brochure Touch Lightbox Modal with Pinch & Swipe Support
 */
function initBrochureLightbox() {
  const brochureCards = document.querySelectorAll('.brochure-card');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!modal || !modalImg) return;

  const images = [
    { src: 'assets/img/Brosur1.png', alt: 'Brosur PPTQ Bagian 1' },
    { src: 'assets/img/Brosur2.png', alt: 'Brosur PPTQ Bagian 2' }
  ];
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    modalImg.alt = images[currentIndex].alt;
  }

  function openLightbox(index) {
    showImage(index);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Add history state for back button handling on mobile
    if (window.history && window.history.pushState) {
      window.history.pushState({ lightboxOpen: true }, '');
    }
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  brochureCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Close when clicking outside image
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Handle browser back button to close lightbox
  window.addEventListener('popstate', (e) => {
    if (modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Touch Swipe gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showImage(currentIndex + 1); // Swipe left -> Next
    } else if (touchEndX > touchStartX + swipeThreshold) {
      showImage(currentIndex - 1); // Swipe right -> Prev
    }
  }
}

/**
 * 6. Smooth Scroll & Fade-Up Animations via IntersectionObserver
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-up');
  
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));
}
