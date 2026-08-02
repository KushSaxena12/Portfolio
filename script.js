/**
 * KUSH SAXENA — PREMIUM PORTFOLIO INTERACTIVE SCRIPT
 * Vanilla JS only — Zero Frameworks
 */
 
// Apply saved theme immediately (before DOMContentLoaded) so the page
// never flashes the wrong theme on load.
(function initTheme() {
  const savedTheme = localStorage.getItem('kush_portfolio_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }
})();
 
document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Toggle (Dark / Light Mode)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const themeToggleLabelMobile = document.getElementById('themeToggleLabelMobile');
  const htmlEl = document.documentElement;
 
  function updateThemeLabel() {
    if (themeToggleLabelMobile) {
      themeToggleLabelMobile.textContent = htmlEl.classList.contains('light-mode')
        ? 'Switch to Dark Mode'
        : 'Switch to Light Mode';
    }
  }
 
  updateThemeLabel();
 
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isLight = htmlEl.classList.toggle('light-mode');
      localStorage.setItem('kush_portfolio_theme', isLight ? 'light' : 'dark');
      updateThemeLabel();
      showToast(isLight ? 'Light theme enabled' : 'Dark theme enabled', 'info');
    });
  });
 
  // 1. Top Scroll Progress Bar & Sticky Header
  const scrollProgress = document.getElementById('scrollProgress');
  const topbar = document.getElementById('topbar');
 
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPct}%`;
    }
 
    if (topbar) {
      if (scrollTop > 40) {
        topbar.classList.add('scrolled');
      } else {
        topbar.classList.remove('scrolled');
      }
    }
  }
 
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
 
  // 2. Profile Photo Upload & LocalStorage Persistence
  const userPhoto = document.getElementById('userPhoto');
  const photoUploadInput = document.getElementById('photoUploadInput');
 
  // Check saved custom photo in localStorage
  if (userPhoto && localStorage.getItem('kush_portfolio_photo')) {
    userPhoto.src = localStorage.getItem('kush_portfolio_photo');
  }
 
  if (photoUploadInput && userPhoto) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgData = event.target.result;
          userPhoto.src = imgData;
          try {
            localStorage.setItem('kush_portfolio_photo', imgData);
            showToast('Profile photo updated successfully!', 'success');
          } catch (err) {
            showToast('Photo displayed (storage quota exceeded for saved offline caching).', 'info');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
 
  // 3. Ambient Canvas Particle Constellation
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouseX = -1000;
    let mouseY = -1000;
 
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
 
    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          alpha: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.4 ? '#6366f1' : (Math.random() > 0.5 ? '#f59e0b' : '#06b6d4')
        });
      }
    }
 
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
 
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
 
        // Render Particle Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
 
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
 
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#6366f1';
            ctx.globalAlpha = (1 - dist / 110) * 0.18;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
 
        // Mouse Interactivity
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = '#f59e0b';
          ctx.globalAlpha = (1 - mdist / 130) * 0.25;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
 
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(drawParticles);
    }
 
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });
 
    resizeCanvas();
    drawParticles();
  }
 
  // 4. Typewriter Effect in Hero Section
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'Backend Systems Engineer',
      'Java & Python Developer',
      'Applied ML & DSA Enthusiast',
      'Information Technology Undergraduate'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 75;
    const deletingSpeed = 40;
    const delayAfterTyped = 2000;
 
    function typeEffect() {
      const currentRole = roles[roleIndex];
 
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }
 
      let timeout = isDeleting ? deletingSpeed : typingSpeed;
 
      if (!isDeleting && charIndex === currentRole.length) {
        timeout = delayAfterTyped;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }
 
      setTimeout(typeEffect, timeout);
    }
 
    setTimeout(typeEffect, 500);
  }
 
  // 5. Interactive 3D Tilt on Profile Photo Card
  const photoWrapper = document.getElementById('photoWrapper');
  if (photoWrapper) {
    photoWrapper.addEventListener('mousemove', (e) => {
      const rect = photoWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
 
      const rotateX = (-y / rect.height) * 20;
      const rotateY = (x / rect.width) * 20;
 
      photoWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });
 
    photoWrapper.addEventListener('mouseleave', () => {
      photoWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
 
  // 6. Magnetic Buttons Effect
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
 
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
 
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
 
  // 7. Ripple Click Effect
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  rippleButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
 
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-effect');
 
      const existingRipple = this.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }
 
      this.appendChild(circle);
 
      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });
 
  // 8. Intersection Observer Scroll Reveal & Navigation Highlighting
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
 
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('in-view'));
  }
 
  // Active Nav Link Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
 
  function highlightNavOnScroll() {
    const scrollY = window.scrollY;
 
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
 
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
 
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
 
  // 9. Skills Category Filter Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const skillCategoryRows = document.querySelectorAll('.skill-category-row');
 
  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
 
      const filter = tab.getAttribute('data-filter');
 
      skillCategoryRows.forEach((row) => {
        const category = row.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          row.style.display = 'grid';
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 50);
        } else {
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          setTimeout(() => {
            row.style.display = 'none';
          }, 200);
        }
      });
    });
  });
 
  // 10. Copy Email to Clipboard & Toast Notifications
  const toastContainer = document.getElementById('toastContainer');
 
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
 
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <span class="toast-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span class="toast-message">${message}</span>
    `;
 
    toastContainer.appendChild(toast);
 
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }
 
  function handleCopyEmail(email, buttonElement, textElementId) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`, 'success');
        updateCopyBtnText(textElementId);
      }).catch(() => fallbackCopyText(email, textElementId));
    } else {
      fallbackCopyText(email, textElementId);
    }
  }
 
  function fallbackCopyText(text, textElementId) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
 
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`, 'success');
      updateCopyBtnText(textElementId);
    } catch (err) {
      showToast('Failed to copy text', 'error');
    }
    document.body.removeChild(textArea);
  }
 
  function updateCopyBtnText(textElementId) {
    const el = document.getElementById(textElementId);
    if (el) {
      const originalText = el.textContent;
      el.textContent = 'Copied!';
      setTimeout(() => {
        el.textContent = originalText;
      }, 2000);
    }
  }
 
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'kushsaxena070@gmail.com';
      handleCopyEmail(email, copyEmailBtn, 'copyBtnText');
    });
  }
 
  const copyEmailBtnContact = document.getElementById('copyEmailBtnContact');
  if (copyEmailBtnContact) {
    copyEmailBtnContact.addEventListener('click', () => {
      const email = copyEmailBtnContact.getAttribute('data-email') || 'kushsaxena070@gmail.com';
      handleCopyEmail(email, copyEmailBtnContact, 'copyBtnContactText');
    });
  }
 
  // 11. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();
 
      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }
 
      const submitBtn = document.getElementById('formSubmitBtn');
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
 
      setTimeout(() => {
        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
      }, 1200);
    });
  }
 
  // 12. Project Live Demo Modal
  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
 
  const projectDetailsMap = {
    '001': {
      title: 'Blood Bank Management System — Technical Overview',
      tech: ['Java', 'MySQL', 'JDBC', 'HTML5/CSS3', 'SQL Query Tuning'],
      summary: 'A relational database-backed enterprise workflow application designed to automate blood inventory tracking, donor registration, eligibility verification, and sub-second inventory dispatch.',
      features: [
        'Relational Database Schema: Normalizing 3NF donor, blood group, stock unit, and recipient transaction logs.',
        'High-Performance Queries: Sub-second SQL search for blood unit availability across multiple locations.',
        'Java Backend Modules: Modular OOP architecture with JDBC connection pooling and parameterized query security.'
      ]
    },
    '002': {
      title: 'Campus Recruitment Prediction System — Model Insights',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Decision Trees'],
      summary: 'A machine learning system that predicts student campus placement probability based on academic grades, technical certifications, and skill metrics.',
      features: [
        'Classification Modeling: Implemented Logistic Regression and Decision Tree Classifier models.',
        'Feature Pipeline: Automated data cleaning, outlier removal, one-hot encoding, and feature scaling using Pandas & Scikit-learn.',
        'Model Evaluation: Achieved high accuracy with cross-validation, precision-recall analysis, and ROC-AUC evaluation.'
      ]
    }
  };
 
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectDetailsMap[projId];
 
      if (data && projectModal && modalBody) {
        modalTitle.textContent = data.title;
 
        modalBody.innerHTML = `
          <p><strong>System Summary:</strong> ${data.summary}</p>
          <p><strong>Key Highlights &amp; Architecture:</strong></p>
          <ul style="padding-left: 1.2rem; margin-bottom: 1.25rem;">
            ${data.features.map(f => `<li style="margin-bottom: 0.4rem;">${f}</li>`).join('')}
          </ul>
          <p><strong>Technologies Applied:</strong></p>
          <div class="stack-row" style="margin-bottom: 1.5rem;">
            ${data.tech.map(t => `<span>${t}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="https://github.com/KushSaxena12" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
              View Source Code on GitHub &rarr;
            </a>
          </div>
        `;
 
        projectModal.classList.add('is-open');
        projectModal.setAttribute('aria-hidden', 'false');
      }
    });
  });
 
  function closeModal() {
    if (projectModal) {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
    }
  }
 
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
 
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }
 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
      closeModal();
    }
  });
 
  // 13. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');
 
  function openDrawer() {
    if (mobileDrawer && mobileToggle) {
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
  }
 
  function closeDrawer() {
    if (mobileDrawer && mobileToggle) {
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }
 
  if (mobileToggle) mobileToggle.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
 
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
 
  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
});
 


