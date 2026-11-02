/* =========================================================
   My HTML Portfolio: main.js
   No libraries, no animation loops, no scroll listeners.
   Scroll-spy uses IntersectionObserver (runs only when a
   section crosses the line, not on every scroll event).
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- 1. Theme toggle ---------- */
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
            root.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (e) { }
        });
    }

    /* ---------- 2. Project data ---------- */
    var projects = {
        curemedix: {
            tag: 'Medicine Shopping · Online Doctor Booking',
            title: 'CureMedix',
            desc: 'A web app for buying medicines online and booking doctor consultations, with separate dashboards for customers, sellers and admins. Includes Stripe checkout, printable invoices and live appointment slot availability.',
            tech: ['React', 'Tailwind CSS', 'Firebase Auth', 'Express.js', 'MongoDB', 'Stripe'],
            link: 'https://cure-medix.vercel.app/'
        },
        elkano64: {
            tag: 'Food Ordering · Table Reservation',
            title: 'Elkano64',
            desc: 'A modern restaurant website where users can browse the menu, order food with stock checks, book tables in 30-minute slots and track everything with live notifications.',
            tech: ['React', 'Tailwind CSS', 'Firebase Auth', 'Express.js', 'MongoDB', 'Formspree'],
            link: 'https://elkano64.vercel.app/'
        },
        newsnexus: {
            tag: 'AI News Summaries · Daily AI Bulletin',
            title: 'NewsNexus',
            desc: 'A full-stack news site built on Guardian stories, with AI article summaries, a chat assistant, a daily AI bulletin, reader reviews and an automated newsletter.',
            tech: ['Next.js', 'React', 'MongoDB', 'NextAuth', 'Gemini AI', 'GitHub Actions'],
            link: 'https://news-nexus-v2.vercel.app/'
        }
    };

    /* ---------- 3. Modals ---------- */
    var projectModal = document.getElementById('project-modal');
    var contactModal = document.getElementById('contact-modal');
    var form = document.getElementById('contact-form');
    var status = document.getElementById('cf-status');
    var submitBtn = document.getElementById('cf-submit');

    function fillProject(key) {
        var p = projects[key];
        if (!p) return false;
        document.getElementById('pm-tag').textContent = p.tag;
        document.getElementById('pm-title').textContent = p.title;
        document.getElementById('pm-desc').textContent = p.desc;
        document.getElementById('pm-link').href = p.link;

        var list = document.getElementById('pm-tech');
        list.textContent = '';
        p.tech.forEach(function (t) {
            var li = document.createElement('li');
            li.textContent = t;
            list.appendChild(li);
        });
        return true;
    }

    function setStatus(msg, type) {
        status.textContent = msg;
        status.className = 'form-status' + (type ? ' is-' + type : '');
    }

    // One delegated click listener handles every open/close action
    document.addEventListener('click', function (e) {
        var el = e.target;
        if (!(el instanceof Element)) return;

        // Click on the dark backdrop (the <dialog> itself) closes it
        if (el.tagName === 'DIALOG' && el.open) { el.close(); return; }

        var closeBtn = el.closest('[data-close]');
        if (closeBtn) { closeBtn.closest('dialog').close(); return; }

        var projectBtn = el.closest('[data-project]');
        if (projectBtn && projectModal) {
            if (fillProject(projectBtn.dataset.project)) projectModal.showModal();
            return;
        }

        var openBtn = el.closest('[data-open="contact"]');
        if (openBtn && contactModal) {
            setStatus('', '');
            contactModal.showModal();
        }
    });

    /* ---------- 4. Contact form (Formspree, no page reload) ---------- */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (submitBtn.disabled) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            setStatus('', '');

            fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('Request failed');
                    form.reset();
                    setStatus('Message sent! I\u2019ll get back to you soon.', 'success');
                    setTimeout(function () {
                        if (contactModal.open) contactModal.close();
                    }, 1600);
                })
                .catch(function () {
                    setStatus('Something went wrong. Please try again.', 'error');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
        });
    }

    /* ---------- 5. Scroll-spy (navbar + footer links) ---------- */
    var spyLinks = document.querySelectorAll('.nav-links a, .footer-nav a');
    var sectionMap = { home: 'home', projects: 'projects', skills: 'projects', about: 'about' };

    function setActive(key) {
        spyLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + key);
        });
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(sectionMap[entry.target.id]);
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        Object.keys(sectionMap).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) observer.observe(section);
        });
    }

    /* ---------- 6. Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();