/**
 * Sathish R - Portfolio Script File
 * Interactive viewport transitions, terminal animations, and canvas particles.
 */

document.addEventListener('DOMContentLoaded', () => {
  initViewRouting();
  initMouseParallax();
  initThemeToggle();
  initProjectsScroll();
  initSkillsParticles();
  initTerminalStream();
  initContactForm();
});

// Cache DOM elements
let currentActiveViewId = 'home-view';

/**
 * Handles sliding view transition logic
 */
function initViewRouting() {
  const navTriggers = document.querySelectorAll('[data-target]');
  const backBtn = document.getElementById('global-back-btn');
  const logoTrigger = document.getElementById('logo-home-trigger');
  const landingBtn = document.getElementById('landing-yin-yang-btn');
  const homeView = document.getElementById('home-view');

  const navigateTo = (targetId) => {
    if (targetId === currentActiveViewId) return;

    const currentView = document.getElementById(currentActiveViewId);
    const targetView = document.getElementById(targetId);

    if (!currentView || !targetView) return;

    // If navigating away from home-view, ensure home-view is ready in split mode behind it
    if (targetId !== 'home-view') {
      homeView.classList.remove('landing-mode');
      homeView.classList.add('split-active-mode');
    }

    // Remove active state from current view
    currentView.classList.remove('view-active');
    currentView.classList.add('view-hidden');

    // Add active state to target view
    targetView.classList.remove('view-hidden');
    targetView.classList.add('view-active');

    // Manage global back button visibility
    if (targetId === 'home-view') {
      if (homeView.classList.contains('split-active-mode')) {
        backBtn.classList.add('btn-visible');
      } else {
        backBtn.classList.remove('btn-visible');
      }
    } else {
      backBtn.classList.add('btn-visible');
    }

    currentActiveViewId = targetId;
    window.location.hash = targetId.replace('-view', '');
  };

  // Bind landing trigger button
  if (landingBtn && homeView) {
    const sharinganIcon = landingBtn.querySelector('.sharingan-icon-large');

    const handleHoverStart = () => {
      if (landingBtn.classList.contains('clicked')) return;
      landingBtn.classList.remove('unhovered-once');
      landingBtn.classList.add('hovered-once');
    };

    const handleHoverEnd = () => {
      if (landingBtn.classList.contains('clicked')) return;
      landingBtn.classList.remove('hovered-once');
      landingBtn.classList.add('unhovered-once');
    };

    landingBtn.addEventListener('mouseenter', handleHoverStart);
    landingBtn.addEventListener('touchstart', handleHoverStart, { passive: true });
    landingBtn.addEventListener('mouseleave', handleHoverEnd);
    landingBtn.addEventListener('touchend', handleHoverEnd, { passive: true });

    if (sharinganIcon) {
      sharinganIcon.addEventListener('animationend', (e) => {
        if (e.animationName === 'sharingan-reverse-once') {
          landingBtn.classList.remove('unhovered-once');
        }
      });
    }

    landingBtn.addEventListener('click', () => {
      landingBtn.classList.add('clicked');
      homeView.classList.remove('landing-mode');
      homeView.classList.add('split-active-mode');
      backBtn.classList.add('btn-visible');
    });
  }

  // Bind navigation links
  navTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      navigateTo(targetId);
    });
  });

  const resetSplits = () => {
    const splitLeft = document.getElementById('split-left-trigger');
    const splitRight = document.getElementById('split-right-trigger');
    if (splitLeft && splitRight) {
      splitLeft.style.width = '';
      splitRight.style.width = '';
    }
  };

  // Bind back button
  backBtn.addEventListener('click', () => {
    if (currentActiveViewId !== 'home-view') {
      navigateTo('home-view');
    } else if (homeView && homeView.classList.contains('split-active-mode')) {
      // Return split home back to center Sharingan landing page
      homeView.classList.remove('split-active-mode');
      homeView.classList.add('landing-mode');
      backBtn.classList.remove('btn-visible');
      window.location.hash = '';
      resetSplits();
      if (landingBtn) {
        landingBtn.classList.remove('clicked');
        landingBtn.classList.remove('hovered-once');
        landingBtn.classList.remove('unhovered-once');
      }
    }
  });

  // Bind logo trigger
  logoTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentActiveViewId !== 'home-view') {
      navigateTo('home-view');
    } else if (homeView && homeView.classList.contains('split-active-mode')) {
      homeView.classList.remove('split-active-mode');
      homeView.classList.add('landing-mode');
      backBtn.classList.remove('btn-visible');
      window.location.hash = '';
      resetSplits();
      if (landingBtn) {
        landingBtn.classList.remove('clicked');
        landingBtn.classList.remove('hovered-once');
        landingBtn.classList.remove('unhovered-once');
      }
    }
  });

  // Route hash on load if present (excluding home view, which should show the landing Sharingan)
  const hash = window.location.hash.replace('#', '');
  if (hash && hash !== 'home') {
    const viewId = `${hash}-view`;
    const checkEl = document.getElementById(viewId);
    if (checkEl) {
      if (homeView) {
        homeView.classList.remove('landing-mode');
        homeView.classList.add('split-active-mode');
      }
      navigateTo(viewId);
    }
  }
}

/**
 * Custom 3D Parallax Hover on Homepage Center Card
 */
function initMouseParallax() {
  const homeView = document.getElementById('home-view');
  const centerCard = document.getElementById('main-profile-card');
  const splitLeft = document.getElementById('split-left-trigger');
  const splitRight = document.getElementById('split-right-trigger');

  if (!homeView || !centerCard) return;

    // Mouse move logic removed to prevent shaking effect


  // Reset transforms when mouse leaves home view
  homeView.addEventListener('mouseleave', () => {
    centerCard.style.transform = 'rotateX(0deg) rotateY(0deg) translate(0, 0)';
  });
}

/**
 * Theme switcher: Terminal Monospace Mode vs Premium Editorial Split Mode
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('global-mode-toggle');
  const iconTerminal = toggleBtn.querySelector('.icon-terminal');
  const iconYinYang = toggleBtn.querySelector('.icon-yin-yang');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isTerminal = document.body.classList.toggle('terminal-theme');

    if (isTerminal) {
      iconTerminal.style.display = 'none';
      iconYinYang.style.display = 'block';
    } else {
      iconTerminal.style.display = 'block';
      iconYinYang.style.display = 'none';
    }
  });
}

/**
 * Intercept mousewheel on projects horizontal scroll wrapper
 */
function initProjectsScroll() {
  const projectsView = document.getElementById('projects-view');
  const wrapper = document.getElementById('projects-horizontal-scroll');

  if (!projectsView || !wrapper) return;

  projectsView.addEventListener('wheel', (e) => {
    // Logic removed to allow standard vertical scrolling
  });
}

/**
 * Dynamic Interactive Particle Mesh Canvas on Skills view
 */
function initSkillsParticles() {
  const canvas = document.getElementById('skills-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particlesArray = [];
  const maxDistance = 110;

  class Particle {
    constructor(x, y, dx, dy, size, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.dx = -this.dx;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    numberOfParticles = Math.min(numberOfParticles, 85); // Cap density

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width - size * 2) + size;
      const y = Math.random() * (canvas.height - size * 2) + size;
      const dx = (Math.random() - 0.5) * 0.8;
      const dy = (Math.random() - 0.5) * 0.8;
      const color = 'rgba(120, 120, 240, 0.15)';

      particlesArray.push(new Particle(x, y, dx, dy, size, color));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const distSq = ((particlesArray[a].x - particlesArray[b].x) ** 2) + 
                       ((particlesArray[a].y - particlesArray[b].y) ** 2);
        
        if (distSq < maxDistance * maxDistance) {
          const dist = Math.sqrt(distSq);
          const opacity = 1 - (dist / maxDistance);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}

/**
 * Animated terminal output simulation for Left background split
 */
function initTerminalStream() {
  const terminal = document.getElementById('terminal-stream');
  if (!terminal) return;

  const logDatabase = [
    'SYSTEM_BOOT: Starting core systems...',
    'INITIALIZE: Spring Boot framework version 3.2.0',
    'DATABASE: Connecting to mongodb://production_server:27017/vault',
    'DB_STATUS: Connection successful. Pool size: 20',
    'SERVER: Mapping routing end points...',
    'ROUTE: GET /api/v1/knowledge-nodes - Status: 200 OK',
    'ROUTE: POST /api/v1/revision-tracker - Status: 201 Created',
    'ALGORITHM: Initializing ML Preprocessor pipeline...',
    'ALGORITHM: Soil profile training inputs scaling... OK',
    'MODEL: Scikit-learn prediction engine running...',
    'SECURE: SSL Certificates initialized successfully',
    'SECURITY: CORS filters mapped to allowed origin: *',
    'JVM_MONITOR: Memory heap allocation - 512MB active',
    'SYSTEM: sathish_r@backend initialized. Port mapping: 8080'
  ];

  let lineCounter = 0;

  const appendLine = () => {
    if (currentActiveViewId !== 'home-view' || !document.getElementById('home-view').classList.contains('split-active-mode')) return;

    const codeLine = document.createElement('div');
    codeLine.textContent = `> ${logDatabase[lineCounter % logDatabase.length]}`;
    terminal.appendChild(codeLine);
    lineCounter++;

    // Limit log size in container to prevent scroll lag
    if (terminal.childNodes.length > 20) {
      terminal.removeChild(terminal.firstChild);
    }

    terminal.scrollTop = terminal.scrollHeight;
  };

  // Spawn log line every 1.5 seconds
  setInterval(appendLine, 1500);
  // Spawn initial lines
  for (let i = 0; i < 6; i++) {
    appendLine();
  }
}

/**
 * Terminal themed contact form submissions
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  // Replace YOUR_FORMSPREE_FORM_ID with the form ID you get from Formspree
  const FORMSPREE_FORM_ID = 'mlgkpnqn';

  if (!form || !formStatus) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showTerminalStatus('[ERROR] All input streams must be populated.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '[ EXECUTING SEND... ]';

    showTerminalStatus('visitor@localhost:~$ packet_sender --payload="msg"', '');

    if (FORMSPREE_FORM_ID === 'YOUR_FORMSPREE_FORM_ID') {
      setTimeout(() => {
        showTerminalStatus('[ERROR] Formspree ID is not configured yet.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '[ RUN SUBMIT ]';
      }, 1000);
      return;
    }

    // Real POST request to Formspree
    fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })
    .then(response => {
      if (response.ok) {
        showTerminalStatus('[SUCCESS] Connection established! Data sent successfully to Sathish R.', 'success');
        form.reset();
      } else {
        showTerminalStatus('[ERROR] Failed to send message. Please try again.', 'error');
      }
    })
    .catch(error => {
      showTerminalStatus('[ERROR] Network connection failed.', 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '[ RUN SUBMIT ]';
    });
  });

  function showTerminalStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'terminal-status-msg';

    if (type === 'success') {
      formStatus.classList.add('success');
    } else if (type === 'error') {
      formStatus.classList.add('error');
    }
  }
}
