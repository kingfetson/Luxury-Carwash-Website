/* ============================================================
   AquaShield Car Wash Nairobi — script.js
   Google Sheets booking capture via Apps Script Web App
   ============================================================

   SETUP:
   1. Deploy Code.gs as a Google Apps Script Web App.
   2. Paste your Web App URL into SHEETS_WEBHOOK_URL below.
   ============================================================ */

'use strict';

// ─── CONFIGURATION ────────────────────────────────────────────
const SHEETS_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initBookingForm();
  initScrollReveal();
  initCounters();
  setYear();
});


// ===== STICKY HEADER =====
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobNav     = document.getElementById('mobNav');
  const mobClose   = document.getElementById('mobClose');
  const mobOverlay = document.getElementById('mobOverlay');
  const mLinks     = document.querySelectorAll('.m-link');

  if (!hamburger || !mobNav) return;

  const open = () => {
    mobNav.classList.add('open');
    mobOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    mobNav.classList.remove('open');
    mobOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', open);
  mobClose?.addEventListener('click', close);
  mobOverlay?.addEventListener('click', close);
  mLinks.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobNav.classList.contains('open')) close();
  });
}


// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight ?? 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ===== BOOKING FORM — GOOGLE SHEETS INTEGRATION =====
function initBookingForm() {
  const form      = document.getElementById('bookingForm');
  const status    = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name')?.value.trim();
    const phone   = document.getElementById('phone')?.value.trim();
    const vehicle = document.getElementById('vehicle')?.value.trim();
    const service = document.getElementById('service')?.value;
    const pkg     = document.getElementById('package')?.value  || 'Not specified';
    const date    = document.getElementById('date')?.value     || 'Not specified';
    const time    = document.getElementById('time')?.value     || 'Any time';
    const notes   = document.getElementById('notes')?.value.trim() || '—';

    // ── Validation ──────────────────────────────────────────
    if (!name)    return showStatus('error', 'Please enter your full name.');
    if (!phone)   return showStatus('error', 'Please enter your phone number.');
    if (!vehicle) return showStatus('error', 'Please enter your vehicle details.');
    if (!service) return showStatus('error', 'Please select a service.');

    const phoneClean = phone.replace(/[\s\-().+]/g, '');
    if (!/^\d{9,15}$/.test(phoneClean)) {
      return showStatus('error', 'Please enter a valid phone number.');
    }

    // ── Loading ─────────────────────────────────────────────
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> CONFIRMING…';

    const payload = {
      name,
      phone,
      vehicle,
      service,
      package     : pkg,
      preferredDate : date,
      preferredTime : time,
      notes,
      submittedAt : new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
      pageUrl     : window.location.href,
      userAgent   : navigator.userAgent,
    };

    const { ok, error } = await sendToSheets(payload);

    if (ok) {
      showStatus('success', '✓ Booking confirmed! We\'ll WhatsApp you within 15 minutes to lock in your slot.');
      form.reset();
    } else {
      console.error('[Sheets] Error:', error);
      showStatus('error', 'Booking failed to send. Please call or WhatsApp us directly.');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> CONFIRM BOOKING';
  });


  // ── Sheets sender ────────────────────────────────────────────
  async function sendToSheets(payload) {
    if (!SHEETS_WEBHOOK_URL || SHEETS_WEBHOOK_URL.includes('YOUR_APPS_SCRIPT')) {
      console.warn(
        '[Sheets] SHEETS_WEBHOOK_URL not set.\n' +
        'Deploy Code.gs and paste the Web App URL at the top of script.js.'
      );
      await delay(800);
      return { ok: true };
    }

    try {
      const res = await fetch(SHEETS_WEBHOOK_URL, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        body    : new URLSearchParams(payload).toString(),
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const json = await res.json().catch(() => ({ result: 'success' }));
      if (json.result === 'error') return { ok: false, error: json.error };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }


  // ── Status helper ────────────────────────────────────────────
  function showStatus(type, message) {
    if (!status) return;
    status.textContent = message;
    status.style.display = 'block';

    if (type === 'success') {
      status.style.background = 'rgba(0,212,232,0.08)';
      status.style.color      = '#007a87';
      status.style.border     = '1px solid rgba(0,212,232,0.3)';
    } else {
      status.style.background = 'rgba(232,68,68,0.08)';
      status.style.color      = '#9b1a1a';
      status.style.border     = '1px solid rgba(232,68,68,0.3)';
    }

    setTimeout(() => { status.style.display = 'none'; },
      type === 'success' ? 7000 : 5000);
  }
}


// ===== SCROLL REVEAL =====
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll(
    '.svc-card, .pkg-card, .step, .testi-card, .cd-item'
  );

  els.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.05}s, transform 0.55s ease ${i * 0.05}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}


// ===== ANIMATED STAT COUNTERS =====
// Counts up hero stats when they enter the viewport
function initCounters() {
  const stats = document.querySelectorAll('.hstat-n');
  if (!stats.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const raw   = el.dataset.target || el.textContent;
      const match = raw.match(/([\d,]+)/);
      if (!match) return;
      const target = parseInt(match[1].replace(',', ''), 10);
      const suffix = raw.replace(match[1], '');
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => {
    // Cache original text as data-target
    el.dataset.target = el.textContent;
    obs.observe(el);
  });
}


// ===== FOOTER YEAR =====
function setYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}


// ===== UTILITY =====
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
