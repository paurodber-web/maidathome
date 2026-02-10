document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    // ==========================================
    // 1. INTERACTION LOGIC (Immediate - No Layout Trashing)
    // ==========================================

    // --- Hamburger Menu ---
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

    // --- Popup Interactions (Close / Copy) ---
    const popup = document.getElementById('discountPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const declineBtn = document.getElementById('declineBtn');
    const promoCode = document.getElementById('promoCode');

    if (popup) {
        // Close Actions
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

        // Copy Code Logic (Optimized for No Reflow)
        if (copyCodeBtn) {
            const updateButtonState = () => {
                const originalText = copyCodeBtn.innerText;
                copyCodeBtn.innerText = 'Copied!';
                copyCodeBtn.classList.add('copied');
                copyCodeBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyCodeBtn.innerText = originalText;
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
                // Read textContent only on click
                const codeText = promoCode ? promoCode.textContent.trim() : "FIRST15";

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(codeText).then(updateButtonState).catch(() => fallbackCopy(codeText));
                } else {
                    fallbackCopy(codeText);
                }
            });
        }
    }

    // ==========================================
    // 2. MOBILE SPECIFIC LOGIC (Immediate & Lightweight)
    // ==========================================
    if (isMobile) {
        // Instant Reveal (No Animation)
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        // Popup Scroll Trigger (Native Event)
        if (popup && !localStorage.getItem('maidAtHomePopupShown')) {
            const checkScrollMobile = () => {
                if (window.scrollY > 500) {
                    popup.classList.add('active');
                    try { localStorage.setItem('maidAtHomePopupShown', 'true'); } catch (e) { }
                    window.removeEventListener('scroll', checkScrollMobile);
                }
            };
            window.addEventListener('scroll', checkScrollMobile, { passive: true });
        }

        // Stop here for mobile - No GSAP loaded
        return;
    }

    // ==========================================
    // 3. DESKTOP ANIMATIONS (GSAP - Deferred)
    // ==========================================
    // Defer initialization to avoid blocking main thread / forced reflow during load
    if (hasGsap) {
        setTimeout(() => {
            gsap.registerPlugin(ScrollTrigger);

            const header = document.getElementById('header');

            // Header Scroll Effect
            if (header) {
                ScrollTrigger.create({
                    trigger: document.body,
                    start: "top -50",
                    onEnter: () => header.classList.add('scrolled'),
                    onLeaveBack: () => header.classList.remove('scrolled')
                });
            }

            // Popup Scroll Effect
            if (popup && !localStorage.getItem('maidAtHomePopupShown')) {
                const showPopup = () => {
                    popup.classList.add('active');
                    try { localStorage.setItem('maidAtHomePopupShown', 'true'); } catch (e) { }
                };

                ScrollTrigger.create({
                    trigger: document.body,
                    start: "800px top",
                    onEnter: showPopup,
                    once: true
                });
            }

            // Section Reveal Animations
            const revealElements = document.querySelectorAll('.reveal');
            gsap.utils.toArray(revealElements).forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%", // Trigger when element is near bottom of viewport
                        once: true
                    }
                });
            });

            // Force recalculation after delay to ensure correct positions
            ScrollTrigger.refresh();

        }, 200); // 200ms delay allows browser layout to settle first
    }
});
