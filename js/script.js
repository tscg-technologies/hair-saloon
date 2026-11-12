/**
 * HAIR SALON - Core Interactive JavaScript
 * Multi-page navigation, scroll effects, accordion, category filtering,
 * form validation, lightbox demo, and back-to-top handler.
 * Pure Vanilla JavaScript - No external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. STICKY HEADER & SCROLL BEHAVIOR
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow and height shrinkage on scroll
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. MOBILE NAVIGATION HAMBURGER MENU
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      const isExpanded = hamburgerBtn.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or clicking any nav link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          hamburgerBtn.classList.remove('active');
          navMenu.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.fade-in-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers or if reduced motion is desired
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // 4. FAQ ACCORDION INTERACTION
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (questionBtn && answer) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close other open accordion items for clean UX
          faqItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('active');
              const otherAnswer = other.querySelector('.faq-answer');
              if (otherAnswer) {
                otherAnswer.style.maxHeight = null;
              }
            }
          });

          // Toggle current item
          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            questionBtn.setAttribute('aria-expanded', 'true');
          } else {
            item.classList.remove('active');
            answer.style.maxHeight = null;
            questionBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  }

  // 5. SERVICE & GALLERY CATEGORY FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableItems = document.querySelectorAll('.filterable-item');

  if (filterBtns.length > 0 && filterableItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        filterableItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. GALLERY LIGHTBOX MODAL (Reusing CSS image placeholders)
  const galleryItems = document.querySelectorAll('.gallery-lightbox-trigger');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const title = item.getAttribute('data-title') || 'Hair Salon Experience';
        const desc = item.getAttribute('data-desc') || 'Premium salon styling and hair care session.';
        const placeholderClass = item.getAttribute('data-placeholder') || 'img-hair-salon-interior';

        if (lightboxPlaceholder) {
          // Clear previous placeholder classes
          lightboxPlaceholder.className = 'lightbox-inner-placeholder img-placeholder ' + placeholderClass;
          lightboxPlaceholder.innerHTML = item.innerHTML;
        }

        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 7. APPOINTMENT & CONTACT FORM VALIDATION
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentAlert = document.getElementById('appointmentAlert');

  if (appointmentForm) {
    // Check if URL has pre-selected service parameter (e.g. contact.html?service=hair-spa)
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedService = urlParams.get('service');
    if (preselectedService) {
      const serviceSelect = document.getElementById('serviceSelect');
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs to validate
      const nameInput = document.getElementById('customerName');
      const phoneInput = document.getElementById('customerPhone');
      const emailInput = document.getElementById('customerEmail');
      const serviceSelect = document.getElementById('serviceSelect');
      const dateInput = document.getElementById('appointmentDate');
      const timeInput = document.getElementById('appointmentTime');

      // Helper validation functions
      const validateField = (input, condition) => {
        if (!condition) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      };

      // 1. Name validation (at least 2 chars)
      if (nameInput) {
        validateField(nameInput, nameInput.value.trim().length >= 2);
      }

      // 2. Phone validation (Indian 10-digit standard or international format)
      if (phoneInput) {
        const phonePattern = /^[0-9+()-\s]{8,16}$/;
        validateField(phoneInput, phonePattern.test(phoneInput.value.trim()));
      }

      // 3. Email validation
      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailPattern.test(emailInput.value.trim()));
      }

      // 4. Service selection
      if (serviceSelect) {
        validateField(serviceSelect, serviceSelect.value !== '');
      }

      // 5. Date selection
      if (dateInput) {
        validateField(dateInput, dateInput.value !== '');
      }

      // 6. Time selection
      if (timeInput) {
        validateField(timeInput, timeInput.value !== '');
      }

      // Submission alert feedback
      if (appointmentAlert) {
        if (!isValid) {
          appointmentAlert.className = 'form-alert alert-danger';
          appointmentAlert.textContent = 'Please fill out all required fields with valid details.';
          appointmentAlert.style.display = 'block';
        } else {
          appointmentAlert.className = 'form-alert alert-success';
          appointmentAlert.innerHTML = `<strong>Appointment Request Received (Demo)!</strong><br>
            Thank you, ${escapeHtml(nameInput.value.trim())}! This frontend demonstration has successfully validated your request for <em>${escapeHtml(serviceSelect.value)}</em> on ${escapeHtml(dateInput.value)} at ${escapeHtml(timeInput.value)}.<br>
            <small style="opacity: 0.85; margin-top: 4px; display: inline-block;">Note: No data was sent to any server. This is a static demonstration.</small>`;
          appointmentAlert.style.display = 'block';

          // Clear form fields
          appointmentForm.reset();

          // Scroll alert into view comfortably
          appointmentAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // Clear error highlight on input
    const formControls = appointmentForm.querySelectorAll('.form-control');
    formControls.forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          input.classList.remove('error');
        }
      });
    });
  }

  // 8. SECURITY HELPER FOR FRONTEND DEMO TEXT
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
});
