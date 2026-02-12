document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

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

        // Copy Code Logic
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
    // 2. MOBILE SPECIFIC LOGIC (Lightweight)
    // ==========================================
    if (isMobile) {
        // Instant Reveal
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        // Popup Scroll Trigger (Native)
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
        return;
    }

    // ==========================================
    // 3. DESKTOP LOGIC (Lazy Load GSAP with Fallback)
    // ==========================================

    // Native Header Scroll (More reliable than ScrollTrigger for this)
    const header = document.getElementById('header');
    if (header) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            if (lastScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        };

        const handleHeaderScroll = () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Check initial state
    }

    // Safety Fallback: Show all reveal elements if GSAP doesn't load
    const safetyTimeout = setTimeout(() => {
        if (typeof gsap === 'undefined') {
            console.warn("GSAP loading timeout - triggering fallback visibility");
            document.querySelectorAll('.reveal').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }, 2500);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    setTimeout(async () => {
        if (typeof gsap === 'undefined') {
            try {
                const scriptTag = document.querySelector('script[src*="main.js"]');
                const scriptPath = scriptTag ? scriptTag.getAttribute('src').replace('main.js', '') : 'js/';

                await loadScript(scriptPath + 'gsap.min.js');
                await loadScript(scriptPath + 'ScrollTrigger.min.js');

                clearTimeout(safetyTimeout);
                initDesktopAnimations();
            } catch (e) {
                console.error("Failed to load GSAP", e);
            }
        } else {
            clearTimeout(safetyTimeout);
            initDesktopAnimations();
        }
    }, 200);

    function initDesktopAnimations() {
        gsap.registerPlugin(ScrollTrigger);

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
                    start: "top 90%",
                    once: true
                }
            });
        });

        ScrollTrigger.refresh();
    }

    // --- Cookie Banner Logic ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const cookieSettingsBtn = document.getElementById('cookieSettings');
    const cookieModal = document.getElementById('cookieModal');
    const closeCookieModalBtn = document.getElementById('closeCookieModal');
    const saveCookieSettingsBtn = document.getElementById('saveCookieSettings');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        // Show banner with a slight delay
        setTimeout(() => {
            cookieBanner.classList.add('active');

            // GSAP Entry Animation
            if (typeof gsap !== 'undefined') {
                gsap.to(cookieBanner, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "expo.out"
                });
            } else {
                cookieBanner.style.opacity = '1';
                cookieBanner.style.transform = 'translateY(0)';
            }
        }, 1500);

        // Accept All Logic
        const acceptAll = () => {
            localStorage.setItem('cookiesAccepted', 'true');
            localStorage.setItem('cookiePrefs', JSON.stringify({ analytics: true, marketing: true }));
            hideBanner();
        };

        const hideBanner = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(cookieBanner, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        cookieBanner.classList.remove('active');
                        cookieBanner.style.display = 'none';
                    }
                });
            } else {
                cookieBanner.style.opacity = '0';
                setTimeout(() => {
                    cookieBanner.classList.remove('active');
                    cookieBanner.style.display = 'none';
                }, 600);
            }
        };

        acceptCookiesBtn.addEventListener('click', acceptAll);

        // Settings Modal Logic
        if (cookieSettingsBtn && cookieModal) {
            cookieSettingsBtn.addEventListener('click', () => {
                cookieModal.classList.add('active');
            });

            const closeModal = () => {
                cookieModal.classList.remove('active');
            };

            if (closeCookieModalBtn) closeCookieModalBtn.addEventListener('click', closeModal);
            cookieModal.addEventListener('click', (e) => {
                if (e.target === cookieModal) closeModal();
            });

            if (saveCookieSettingsBtn) {
                saveCookieSettingsBtn.addEventListener('click', () => {
                    const analytics = document.getElementById('analyticsCookies').checked;
                    const marketing = document.getElementById('marketingCookies').checked;

                    localStorage.setItem('cookiesAccepted', 'true');
                    localStorage.setItem('cookiePrefs', JSON.stringify({ analytics, marketing }));

                    closeModal();
                    hideBanner();
                });
            }
        }
    }
});
