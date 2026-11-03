/* =========================================================
   Izwan Systec Enterprise - Main Script
   ========================================================= */
(function () {
    'use strict';

    var WHATSAPP_NUMBER = '60174511455';

    var nav = document.getElementById('siteNav');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var scrollBtn = document.getElementById('scrollUp');

    /* ---------- Sidebar (mobile) ---------- */
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        sidebar.setAttribute('aria-hidden', 'false');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        sidebar.setAttribute('aria-hidden', 'true');
    }

    document.getElementById('menuToggle').addEventListener('click', openSidebar);
    document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // Close sidebar when going back to desktop width
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) closeSidebar();
    });

    /* ---------- Smooth anchor scroll (offset for fixed nav) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            closeSidebar();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', id);
        });
    });

    /* ---------- Scroll state: navbar, back-to-top ---------- */
    var ticking = false;
    function onScroll() {
        var y = window.scrollY;
        nav.classList.toggle('scrolled', y > 40);
        scrollBtn.classList.toggle('show', y > 400);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Active nav link per section ---------- */
    var navLinks = document.querySelectorAll('.nav-links a, .sidebar-menu a');
    var trackedSections = document.querySelectorAll('section[id]');

    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = '#' + entry.target.id;
                navLinks.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        trackedSections.forEach(function (s) { sectionObserver.observe(s); });

        /* ---------- Reveal on scroll ---------- */
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.fade-in').forEach(function (el) { revealObserver.observe(el); });
    } else {
        document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- "Read more" modal ---------- */
    var modalEl = document.getElementById('detailModal');
    if (modalEl && window.bootstrap) {
        var modal = new bootstrap.Modal(modalEl);
        var mTitle = document.getElementById('detailTitle');
        var mBody = document.getElementById('detailBody');
        var mImg = document.getElementById('detailImg');
        var mCta = document.getElementById('detailCta');

        document.querySelectorAll('[data-detail]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var title = btn.getAttribute('data-title');
                mTitle.textContent = title;
                mBody.textContent = btn.getAttribute('data-detail');
                var img = btn.getAttribute('data-img');
                if (img) {
                    mImg.src = img;
                    mImg.alt = title;
                    mImg.hidden = false;
                } else {
                    mImg.hidden = true;
                }
                mCta.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
                    encodeURIComponent('Salam, saya berminat dengan ' + title + '. Boleh saya dapatkan maklumat lanjut?');
                modal.show();
            });
        });
    }

    /* ---------- Contact form -> WhatsApp ---------- */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var status = document.getElementById('formStatus');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                status.className = 'form-status text-danger';
                status.textContent = 'Sila lengkapkan semua ruangan yang diperlukan.';
                return;
            }
            var name = form.elements.name.value.trim();
            var email = form.elements.email.value.trim();
            var topic = form.elements.topic.value;
            var msg = form.elements.message.value.trim();
            var text = 'Salam Izwan Systec,\n\nNama: ' + name + '\nEmail: ' + email +
                '\nPerkara: ' + topic + '\n\n' + msg;
            window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
            status.className = 'form-status text-success';
            status.textContent = 'Terima kasih! WhatsApp dibuka untuk menghantar mesej anda.';
            form.reset();
            form.classList.remove('was-validated');
        });
    }

    /* ---------- Footer year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
