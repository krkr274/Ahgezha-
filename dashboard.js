/* ============================================
   AHGEZHA — DASHBOARD JS (BACKEND READY)
   ============================================ */
   /* ============================================
   AHGEZHA — DASHBOARD JS (UPDATED)
   ============================================ */

const BASE_URL = 'http://localhost:5092/api'; // لينك الباك-إيند بتاعك

// دالة لجلب الباقات من الداتابيز بدل الكود الثابت
async function loadServerPackages() {
    try {
        const response = await fetch(`${BASE_URL}/packages`);
        if (response.ok) {
            const data = await response.json();
            // هنا بنحدث بيانات الـ packages باللي جاي من الـ API
            Object.assign(packages, data); 
            renderRecs(); // بنعيد الرسم بعد ما الداتا تيجي
        }
    } catch (err) {
        console.error("Connection error:", err);
    }
}

// استدعي الدالة دي لما الصفحة تحمل
document.addEventListener('DOMContentLoaded', () => {
    loadServerPackages();
});
// تعديل دالة الحجز لترسل للباك-إيند

async function submitBooking() {
    const token = localStorage.getItem('token'); // التوكن اللي سيفناه في الـ Login
    
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
            eventDate: new Date(),
            // باقي البيانات اللي الباك محتاجها
        })
    });

    if (response.ok) {
        alert('🎉 تم الحجز بنجاح ومزامنته مع السيرفر!');
        showPage('overview-page');
    } else {
        alert('حدث خطأ في الحجز، تأكد من اتصال السيرفر.');
    }
}
// ... باقي الكود (renderNav, switchRole) يفضل كما هو للعرض ...