/* ============================================
   AHGEZHA — REGISTER JS (UPDATED FOR BACKEND)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5092/api/auth/register';

    const form = document.getElementById('regForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const username = document.getElementById('regUser').value.trim();
        const email    = document.getElementById('regEmail').value.trim();
        const pass     = document.getElementById('regPass').value;
        const confirm  = document.getElementById('confirmPass').value;
        const btn      = form.querySelector('.btn-form');

        if (pass !== confirm) { showError('Passwords do not match.'); return; }

        btn.textContent = 'CREATING ACCOUNT...';
        btn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password: pass })
            });

            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Registration failed.');
                btn.textContent = 'REGISTER';
                btn.disabled = false;
            }
        } catch (err) {
            showError('Server connection failed.');
            btn.disabled = false;
        }
    });

    function showError(msg) {
        let err = document.getElementById('regError') || document.createElement('p');
        err.id = 'regError';
        err.style.cssText = 'color:#c0392b;font-size:.82rem;margin-top:12px;text-align:center;';
        err.textContent = msg;
        if (!document.getElementById('regError')) form.appendChild(err);
    }
});