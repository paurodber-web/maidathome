document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    // Register GSAP for Desktop
    if (!isMobile && hasGsap) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================
    // 1. HAMBURGER MENU (Universal - Critical)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        const closeMenu = () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', toggleMenu);
        if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // ==========================================
    // 2. HEADER SCROLL (Desktop Only - Mobile handled by CSS Sticky if needed)
    // ==========================================
    const header = document.getElementById('header');
    if (header && !isMobile && hasGsap) {
        ScrollTrigger.create({
            trigger: document.body,
            start: "top -50",
            onEnter: () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled')
        });
    }

    // ==========================================
    // 3. DISCOUNT POPUP (Universal Logic)
    // ==========================================
    const popup = document.getElementById('discountPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const declineBtn = document.getElementById('declineBtn');
    const promoCode = document.getElementById('promoCode');

    if (popup) {
        // --- Interactions ---
        const closePopup = () => popup.classList.remove('active');
        if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
        if (declineBtn) {
            declineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
            });
        }
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });

        // --- Copy Logic (Robust) ---
        // --- Copy Logic (Robust) ---
        if (copyCodeBtn) {
            const updateButtonState = () => {
                const originalText = copyCodeBtn.innerText;
                copyCodeBtn.innerText = 'Copied!';
                copyCodeBtn.classList.add('copied');
                copyCodeBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyCodeBtn.innerText = originalText; // Or 'Copy Code'
                    copyCodeBtn.classList.remove('copied');
                    copyCodeBtn.style.background = '';
                }, 2000);
            };

            const fallbackCopy = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    updateButtonState();
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            };

            copyCodeBtn.addEventListener('click', () => {
                // Read text ONLY on click to avoid forced reflow on page load
                // Use textContent instead of innerText for better performance
                const codeText = promoCode ? promoCode.textContent.trim() : "FIRST15";

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(codeText).then(updateButtonState).catch(() => fallbackCopy(codeText));
                } else {
                    fallbackCopy(codeText);
                }
            });
        }

        // --- Trigger Logic (Show Popup) ---
        const hasSeenPopup = localStorage.getItem('maidAtHomePopupShown');

        if (!hasSeenPopup) {
            const showPopup = () => {
                popup.classList.add('active');
                try { localStorage.setItem('maidAtHomePopupShown', 'true'); } catch (e) { }
            };

            if (isMobile) {
                // Mobile: Show on scroll > 500px (Native Event)
                const checkScrollMobile = () => {
                    if (window.scrollY > 500) {
                        showPopup();
                        window.removeEventListener('scroll', checkScrollMobile);
                    }
                };
                window.addEventListener('scroll', checkScrollMobile, { passive: true });
            } else if (hasGsap) {
                // Desktop: Show on scroll > 800px (GSAP)
                ScrollTrigger.create({
                    trigger: document.body,
                    start: "800px top",
                    onEnter: showPopup,
                    once: true
                });
            }
        }
    }

    // ==========================================
    // 4. REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if (isMobile) {
        // Mobile: Show instantly (No reflows)
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    } else if (hasGsap) {
        // Desktop: GSAP Animations
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
    }
});
