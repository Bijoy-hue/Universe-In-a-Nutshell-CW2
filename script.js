// Typewriter Effect
document.addEventListener('DOMContentLoaded', function() {
  const typedTarget = document.querySelector('#typed-text');
  if (typeof Typed !== 'undefined' && typedTarget) {
    const typed = new Typed('#typed-text', {
      strings: ['Stars', 'Galaxies', 'Planets', 'Black Holes', 'Dark Energy'],
      typeSpeed: 70,
      backSpeed: 40,
      loop: true
    });
  }

  // Cookie helpers
  function setCookie(name, value, { days = 365, path = "/", sameSite = "Lax", secure = false } = {}) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Expires=${expires}; Path=${path}; SameSite=${sameSite}`;
    if (secure) cookie += `; Secure`;
    document.cookie = cookie;
  }

  function getCookie(name) {
    const key = encodeURIComponent(name) + "=";
    return document.cookie.split('; ').reduce((acc, part) => {
      if (part.indexOf(key) === 0) acc = decodeURIComponent(part.substring(key.length));
      return acc;
    }, null);
  }

  function deleteCookie(name, path = "/") {
    document.cookie = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;
  }

// jQuery enhancements (run after DOM is ready) — guard if jQuery is present
if (window.jQuery) {
  (function ($) {
    $(function () {
      // Smooth scroll for nav links that point to anchors
      $('nav a[href^="#"]').on('click', function (e) {
        var targetId = $(this).attr('href');
        if (targetId && targetId.length > 1 && $(targetId).length) {
          e.preventDefault();
          $('html, body').animate({ scrollTop: $(targetId).offset().top }, 600);
        }
      });

      // Mobile nav toggle (toggle class and aria-expanded)
      var $navToggle = $('.nav-toggle');
      $navToggle.on('click', function () {
        var $nav = $('nav');
        $nav.toggleClass('open');
        var isOpen = $nav.hasClass('open');
        $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Subtle focus class on cards for CSS-driven effects
      var $cards = $('.interactive-cards-section .card');
      $cards.on('mouseenter', function () { $(this).addClass('focus'); });
      $cards.on('mouseleave', function () { $(this).removeClass('focus'); });

      // Signup form toggle with animation and aria updates
      var $signupBtn = $('#signup-toggle');
      var $signupForm = $('#signup-form');
      if ($signupBtn.length && $signupForm.length) {
        $signupBtn.on('click', function (e) {
          e.preventDefault();
          if ($signupForm.is(':visible')) {
            $signupForm.stop(true, true).slideUp(200);
            $signupBtn.attr('aria-expanded', 'false').text('Sign Up');
          } else {
            $signupForm.stop(true, true).slideDown(200, function () {
              $signupForm.css('display', 'flex');
            });
            $signupBtn.attr('aria-expanded', 'true').text('Hide Form');
          }
        });
      }
    });
  })(window.jQuery);
}

  // Cookie consent banner logic
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const isHttps = window.location && window.location.protocol === 'https:';
  if (cookieBanner && !getCookie('cookie_consent')) {
    cookieBanner.style.display = 'block';
  }
  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', function () {
      setCookie('cookie_consent', 'yes', { days: 365, sameSite: 'Lax', secure: isHttps });
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  // Scroll Reveal Animation
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  fadeEls.forEach(el => {
    observer.observe(el);
  });

  // Fallback: Make all fade-in elements visible after 2 seconds if they're still not visible
  setTimeout(() => {
    fadeEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 2000);

  // Scroll Reveal Animation for planets-grid
  const planetsGrid = document.querySelector('.planets-grid');
  if (planetsGrid) {
    const planetsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          planetsGrid.classList.add('visible');
          planetsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    planetsObserver.observe(planetsGrid);

    // Cleanup: ensure any previously added caption elements are removed
    document.querySelectorAll('.card-caption').forEach(el => el.remove());
  }

  // Mission section: staggered reveal for mission cards
  const missionCards = document.querySelectorAll('.mission-grid .mission-card');
  if (missionCards && missionCards.length) {
    missionCards.forEach((card, idx) => {
      // Add slight stagger only for users not preferring reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        card.style.transitionDelay = `${Math.min(idx * 120, 360)}ms`;
      }
    });
  }

  // Mission metrics: count-up animation when metrics strip enters viewport
  const metricsStrip = document.querySelector('.mission-metrics');
  if (metricsStrip) {
    const values = Array.from(metricsStrip.querySelectorAll('.metric-value'));
    let hasRun = false;

    // Format numbers with grouping (e.g., 12,000)
    const formatNumber = (num) => new Intl.NumberFormat(undefined).format(Math.round(num));

    const animateCount = (el, target, duration = 1200) => {
      const start = 0;
      const startTime = performance.now();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        el.textContent = formatNumber(target);
        return;
      }
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(progress);
        const current = start + (target - start) * eased;
        el.textContent = formatNumber(current);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          values.forEach((el, i) => {
            const target = parseInt(el.getAttribute('data-count') || '0', 10);
            // small per-item stagger
            setTimeout(() => animateCount(el, target), i * 120);
          });
          metricObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    metricObserver.observe(metricsStrip);
  }

  // Fun Facts Slider
  const slides = document.querySelectorAll('.fun-fact-slide');
  const prevBtn = document.querySelector('.fun-facts-prev');
  const nextBtn = document.querySelector('.fun-facts-next');
  const dotsContainer = document.querySelector('.fun-facts-dots');
  let dots = [];
  let autoTimer = null;
  const cardEl = document.querySelector('.fun-facts-card');
  const sliderEl = document.querySelector('.fun-facts-slider');
  let currentSlide = 0;
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    if (dots && dots.length) {
      dots.forEach((dot, i) => {
        const isActive = i === idx;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  }
  if (slides && slides.length) {
    // Initialize from any pre-marked active slide
    const presetIdx = Array.from(slides).findIndex(el => el.classList.contains('active'));
    currentSlide = presetIdx >= 0 ? presetIdx : 0;
    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      dots = Array.from(slides).map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'fun-facts-dot';
        dot.setAttribute('aria-label', `Go to fact ${i + 1}`);
        dot.addEventListener('click', () => {
          currentSlide = i;
          showSlide(currentSlide);
        });
        dotsContainer.appendChild(dot);
        return dot;
      });
    }
    showSlide(currentSlide);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }
    // Auto-advance with pause on hover
    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    };
    const stopAuto = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };
    startAuto();
    const hoverTargets = [cardEl, sliderEl, prevBtn, nextBtn, dotsContainer].filter(Boolean);
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', stopAuto);
      el.addEventListener('mouseleave', startAuto);
    });
  }

  // Smooth scroll for CTA and scroll indicator
  const heroCta = document.querySelector('.hero-cta');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  function scrollToPlanets(e) {
    e.preventDefault();
    const target = document.querySelector('#planets');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
  if (heroCta) heroCta.addEventListener('click', scrollToPlanets);
  if (scrollIndicator) scrollIndicator.addEventListener('click', scrollToPlanets);

  // Enhanced signup form validation and submission
  const signupForm = document.getElementById('signup-form');
  const signupName = document.getElementById('signup-name');
  const signupEmail = document.getElementById('signup-email');
  const signupMobile = document.getElementById('signup-mobile');
  const signupDOB = document.getElementById('signup-dob');
  const formMessage = document.getElementById('form-message');
  const signupToggle = document.getElementById('signup-toggle');

  // Form is already hidden via inline style in HTML, no need to set it again
  // This avoids conflicts between inline styles and JS style manipulation

  // LocalStorage: prefill and autosave draft for signup form
  const draftFieldIds = ['signup-name','signup-email','signup-mobile','signup-dob'];
  if (signupForm) {
    draftFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const saved = localStorage.getItem(id);
      if (saved) el.value = saved;
      el.addEventListener('input', () => localStorage.setItem(id, el.value));
    });
  }

  // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10,15}$/; // Basic pattern for mobile numbers

  // Name validation
  if (signupName) {
    signupName.addEventListener('input', function() {
      const name = signupName.value.trim();
      
      if (name === "") {
        signupName.classList.remove('valid', 'invalid');
      } else if (name.length >= 2) { // At least 2 characters
        signupName.classList.remove('invalid');
        signupName.classList.add('valid');
      } else {
        signupName.classList.remove('valid');
        signupName.classList.add('invalid');
      }
    });
  }

  // Email validation
  if (signupEmail) {
    signupEmail.addEventListener('input', function() {
      const email = signupEmail.value;

      if (email === "") {
        signupEmail.classList.remove('valid', 'invalid');
      } else if (emailRegex.test(email)) {
        signupEmail.classList.remove('invalid');
        signupEmail.classList.add('valid');
      } else {
        signupEmail.classList.remove('valid');
        signupEmail.classList.add('invalid');
      }
    });
  }

  // Mobile validation
  if (signupMobile) {
    signupMobile.addEventListener('input', function() {
      const mobile = signupMobile.value;

      if (mobile === "") {
        signupMobile.classList.remove('valid', 'invalid');
      } else if (mobileRegex.test(mobile)) {
        signupMobile.classList.remove('invalid');
        signupMobile.classList.add('valid');
      } else {
        signupMobile.classList.remove('valid');
        signupMobile.classList.add('invalid');
      }
    });
  }

  // DOB validation
  if (signupDOB) {
    signupDOB.addEventListener('input', function() {
      const dob = signupDOB.value;
      
      if (dob === "") {
        signupDOB.classList.remove('valid', 'invalid');
      } else {
        // Check if date is valid and not in the future
        const selectedDate = new Date(dob);
        const today = new Date();
        
        if (selectedDate <= today) {
          signupDOB.classList.remove('invalid');
          signupDOB.classList.add('valid');
        } else {
          signupDOB.classList.remove('valid');
          signupDOB.classList.add('invalid');
        }
      }
    });
  }

  // Toggle form visibility (vanilla fallback if jQuery isn't available)
  if (typeof window.jQuery === 'undefined' && signupToggle) {
    signupToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const currentDisplay = signupForm.style.display || getComputedStyle(signupForm).display;
      if (currentDisplay === 'none') {
        signupForm.style.display = 'flex';
        signupToggle.setAttribute('aria-expanded', 'true');
        signupToggle.textContent = 'Hide Form';
      } else {
        signupForm.style.display = 'none';
        signupToggle.setAttribute('aria-expanded', 'false');
        signupToggle.textContent = 'Sign Up';
      }
    });
  }

  // Form submission
  if (signupForm && formMessage) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get values
      const name = signupName ? signupName.value.trim() : "";
      const email = signupEmail ? signupEmail.value : "";
      const mobile = signupMobile ? signupMobile.value : "";
      const dob = signupDOB ? signupDOB.value : "";
      
      // Validate all fields
      let isValid = true;
      
      if (name === "" || name.length < 2) {
        isValid = false;
        signupName.classList.add('invalid');
      }
      
      if (email === "" || !emailRegex.test(email)) {
        isValid = false;
        signupEmail.classList.add('invalid');
      }
      
      if (mobile === "" || !mobileRegex.test(mobile)) {
        isValid = false;
        signupMobile.classList.add('invalid');
      }
      
      if (dob === "") {
        isValid = false;
        signupDOB.classList.add('invalid');
      } else {
        const selectedDate = new Date(dob);
        const today = new Date();
        if (selectedDate > today) {
          isValid = false;
          signupDOB.classList.add('invalid');
        }
      }
      
      if (isValid) {
        formMessage.textContent = "Thank you for joining our cosmic community! Welcome aboard, " + name + ".";
        formMessage.className = "form-message success";

        // Persist consolidated record and set a cookie
        const record = {
          name, email, mobile, dob
        };
        try {
          localStorage.setItem('signup_record', JSON.stringify(record));
        } catch (e) { /* ignore quota errors */ }
        // Mark signup intent via cookie
        const isHttps = window.location && window.location.protocol === 'https:';
        setCookie('signed_up', 'true', { days: 180, sameSite: 'Lax', secure: isHttps });

        // Clear draft fields after successful submit
        ['signup-name','signup-email','signup-mobile','signup-dob'].forEach(k => localStorage.removeItem(k));

        // Reset form
        signupForm.reset();
        signupName.classList.remove('valid');
        signupEmail.classList.remove('valid');
        signupMobile.classList.remove('valid');
        signupDOB.classList.remove('valid');
        
        // Hide form after submission
        if (window.jQuery) {
          $('#signup-form').stop(true, true).slideUp(200);
        } else {
          signupForm.style.display = 'none';
        }
        signupToggle.setAttribute('aria-expanded', 'false');
        signupToggle.textContent = 'Sign Up';
        
        // Reset message after 3 seconds
        setTimeout(function() {
          formMessage.textContent = "";
          formMessage.className = "form-message";
        }, 3000);
      } else {
        formMessage.textContent = "Please fill in all fields with valid information.";
        formMessage.className = "form-message error";
      }
    });
  }

  // Navigate to planets details page when the planets tile is clicked
  const planetsTile = document.querySelector('#planets');
  if (planetsTile) {
    planetsTile.setAttribute('tabindex', '0');
    planetsTile.setAttribute('role', 'link');
    planetsTile.style.cursor = 'pointer';
    const goToDetails = (e) => {
      // If an inner anchor is clicked, let the default behavior happen
      if (e.target && typeof e.target.closest === 'function' && e.target.closest('a')) return;
      window.location.href = 'planets.html';
    };
    planetsTile.addEventListener('click', goToDetails);
    planetsTile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToDetails(e);
      }
    });
  }

  // Fallback: if there is no element with id="planets", bind the card whose title text is "PLANETS"
  if (!planetsTile) {
    const planetCards = document.querySelectorAll('.planet');
    planetCards.forEach(card => {
      const titleEl = card.querySelector('.planet-title');
      if (titleEl && titleEl.textContent.trim().toUpperCase() === 'PLANETS') {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.style.cursor = 'pointer';
        const goToDetails = (e) => {
          if (e.target && typeof e.target.closest === 'function' && e.target.closest('a')) return;
          window.location.href = 'planets.html';
        };
        card.addEventListener('click', goToDetails);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToDetails(e);
          }
        });
      }
    });
  }

  // Contact page: signup modal logic
  const signupModal = document.getElementById('signup-modal');
  const navOpenSignup = document.getElementById('nav-open-signup');
  function openSignupModal() {
    if (!signupModal) return;
    signupModal.classList.add('open');
    signupModal.setAttribute('aria-hidden', 'false');
    signupModal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    const firstInput = signupModal.querySelector('#signup-name');
    if (firstInput) firstInput.focus();
  }
  function closeSignupModal() {
    if (!signupModal) return;
    signupModal.classList.remove('open');
    signupModal.setAttribute('aria-hidden', 'true');
    signupModal.setAttribute('aria-modal', 'false');
    document.body.style.overflow = '';
  }
  if (signupModal) {
    // Open from nav button
    if (navOpenSignup) {
      navOpenSignup.addEventListener('click', function(e) {
        e.preventDefault();
        openSignupModal();
      });
    }
    // Close on backdrop or close button
    document.querySelectorAll('[data-dismiss="signup-modal"]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        closeSignupModal();
      });
    });
    // Close on Escape
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && signupModal.classList.contains('open')) {
        closeSignupModal();
      }
    });
    // Auto-open via URL parameter
    const params = new URLSearchParams(window.location.search);
    const openParam = params.get('openSignup');
    if (openParam === '1' || openParam === 'true') {
      openSignupModal();
    }
  }

  // Contact form basic handler
  const contactForm = document.getElementById('contact-form');
  const contactMsg = document.getElementById('contact-form-message');
  if (contactForm && contactMsg) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      contactMsg.textContent = 'Thanks! Your message has been sent.';
      contactMsg.className = 'form-message success';
      contactForm.reset();
      setTimeout(function(){
        contactMsg.textContent = '';
        contactMsg.className = 'form-message';
      }, 3000);
    });
  }

});