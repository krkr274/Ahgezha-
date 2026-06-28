/* ============================================
   AHGEZHA — LOGIN JS (UPDATED FOR BACKEND)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5092/api/auth/login';

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const pass  = document.getElementById('password').value;
        const btn   = form.querySelector('.btn-form');

        btn.textContent = 'VERIFYING...';
        btn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });

            if (response.ok) {
                const data = await response.json();
                // حفظ بيانات الجلسة
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', data.username);
                localStorage.setItem('token', data.token); // لو الباك بيبعت توكن
                
                btn.textContent = 'WELCOME BACK...';
                setTimeout(() => { window.location.href = 'index.html'; }, 800);
            } else {
                showError('Invalid email or password.');
                btn.textContent = 'LOGIN';
                btn.disabled = false;
            }
        } catch (err) {
            showError('Could not connect to server.');
            btn.disabled = false;
        }
    });

    function showError(msg) {
        let err = document.getElementById('loginError') || document.createElement('p');
        err.id = 'loginError';
        err.style.cssText = 'color:#c0392b;font-size:.82rem;margin-top:12px;text-align:center;';
        err.textContent = msg;
        if (!document.getElementById('loginError')) form.appendChild(err);
    }
});