/* ============================================
   AHGEZHA — MAIN JS (shared across all pages)
   ============================================ */

// ── Cursor ──────────────────────────────────
// ده الرابط الأساسي للباك إند
// const API_BASE_URL = "http://localhost:5092/api";
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (cursor && follower) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    });
    (function animFollower() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        requestAnimationFrame(animFollower);
    })();
    document.querySelectorAll('a, button, .service-card, .venue-card, .testimonial-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(2)';
            follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
            follower.style.opacity = '0.2';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            follower.style.transform = 'translate(-50%,-50%) scale(1)';
            follower.style.opacity = '0.6';
        });
    });
}

// ── Navbar scroll ────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar && !navbar.classList.contains('solid')) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
}

// ── Hero parallax ────────────────────────────
const heroBgImg = document.getElementById('heroBgImg');
const heroContent = document.querySelector('.hero-content');
if (heroBgImg) {
    setTimeout(() => heroBgImg.classList.add('loaded'), 100);
}
if (heroContent) {
    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        if (s < window.innerHeight) {
            heroContent.style.transform = `translateY(${s * 0.3}px)`;
            heroContent.style.opacity = 1 - s / (window.innerHeight * 0.7);
        }
    });
}

// ── Scroll reveal ────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Search ───────────────────────────────────
const activitiesList = [
    { name: 'Wedding Halls',    url: 'wedding.html' },
    { name: 'Engagement Halls', url: 'engagement.html' },
    { name: 'Birthday Halls',   url: 'birthday.html' },
    { name: 'Event Halls',      url: 'events.html' },
    { name: 'Graduation Halls', url: 'graduation.html' },
    { name: 'Meeting Rooms',    url: 'meeting.html' },
    { name: 'Party Halls',      url: 'party.html' },
    { name: 'Workshop Halls',   url: 'workshop.html' },
    { name: 'Dashboard',        url: 'dashboard.html' },
    { name: 'About Us',         url: 'about.html' },
    { name: 'Contact',          url: 'contact.html' },
];
const searchInput    = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', e => {
        const val = e.target.value.toLowerCase();
        searchDropdown.innerHTML = '';
        if (val.length > 0) {
            const matches = activitiesList.filter(a => a.name.toLowerCase().includes(val));
            if (matches.length) {
                searchDropdown.style.display = 'flex';
                matches.forEach(item => {
                    const a = document.createElement('a');
                    a.className = 'search-item';
                    a.href = item.url;
                    a.textContent = item.name;
                    searchDropdown.appendChild(a);
                });
            } else {
                searchDropdown.style.display = 'none';
            }
        } else {
            searchDropdown.style.display = 'none';
        }
    });
    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target)) searchDropdown.style.display = 'none';
    });
}

// ── Auth nav state ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username   = localStorage.getItem('username') || 'User';
    const authLink   = document.getElementById('authLink');
    if (isLoggedIn && authLink) {
        const nav = authLink.parentElement;
        const span = document.createElement('span');
        span.innerHTML = `Hi, <strong>${username}</strong>`;
        span.style.cssText = 'color:#c6ac8f;font-size:.82rem;letter-spacing:1px;';
        const logout = document.createElement('a');
        logout.href = '#';
        logout.textContent = 'Logout';
        logout.style.cssText = 'color:white;font-size:.82rem;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;cursor:pointer;';
        logout.addEventListener('click', e => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_password');
            window.location.href = 'index.html';
        });
        authLink.replaceWith(span);
        span.after(logout);
    }

    // Protect booking buttons
    document.querySelectorAll('.btn-book, .btn-hero-primary, .btn-cta').forEach(btn => {
        btn.addEventListener('click', e => {
            const href = btn.getAttribute('href');
            const skip = ['login.html', 'register.html', 'about.html', 'contact.html', '#services', '#'];
            if (href && !skip.some(s => href.includes(s))) {
                if (!isLoggedIn) {
                    e.preventDefault();
                    alert('Please login or register first to book a venue!');
                    window.location.href = 'login.html';
                }
            }
        });
    });
});

// ── Payment Gateway ──────────────────────────
function openPaymentGateway(venueName, price) {
    const modal       = document.getElementById('paymentModal');
    const amountEl    = document.getElementById('modalTotalAmount');
    const venueTitleEl= document.getElementById('venueTitle');
    if (!modal) return;
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login first to book a venue!');
        window.location.href = 'login.html';
        return;
    }
    if (amountEl)     amountEl.textContent     = price.toLocaleString() + ' EGP';
    if (venueTitleEl) venueTitleEl.textContent  = venueName;
    modal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
}

function processFinalPayment(e) {
    e.preventDefault();
    const btn = document.getElementById('payBtnSubmit');
    if (!btn) return;
    btn.textContent = 'Processing...';
    btn.disabled = true;
    setTimeout(() => {
        alert('✨ Booking confirmed! You will receive a confirmation shortly.');
        closePaymentModal();
        btn.textContent = 'PAY & CONFIRM';
        btn.disabled = false;
    }, 2200);
}

// ── Scroll animation for promo cards (legacy) ─
const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.venue-card, .footer-col').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    scrollObserver.observe(el);
});
// البحث عن جزء الـ Auth nav state وتعديله:
logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear(); // بيمسح كل حاجة (token, username, isLoggedIn)
    window.location.href = 'index.html';
});