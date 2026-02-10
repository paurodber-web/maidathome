document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile devices to prevent layout thrashing
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // --- HAMBURGER MENU LOGIC (Always Active) ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- MOBILE OPTIMIZATION: STOP HERE ---
    // On mobile, we skip GSAP entirely to avoid forced reflows and layout thrashing
    if (isMobile) {
        // Ensure reveal elements are visible immediately
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    // --- DESKTOP ONLY: GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    const header = document.getElementById('header');
    if (header) {
        ScrollTrigger.create({
            start: "top -50",
            onEnter: () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled')
        });
    }

    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true
            }
        });
    });
});
