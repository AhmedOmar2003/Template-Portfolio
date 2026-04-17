/**
 * Premium Portfolio - GSAP Animated Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Language Switcher Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const htmlEl = document.documentElement;

    function updatePlaceholders(lang) {
        const inputs = document.querySelectorAll('[data-placeholder-en]');
        inputs.forEach(input => {
            const newPlaceholder = input.getAttribute(`data-placeholder-${lang}`);
            if (newPlaceholder) {
                input.setAttribute('placeholder', newPlaceholder);
            }
        });
    }

    const savedLang = localStorage.getItem('portfolio_lang') || 'en';
    if (savedLang === 'ar') {
        htmlEl.setAttribute('lang', 'ar');
        htmlEl.setAttribute('dir', 'rtl');
        updatePlaceholders('ar');
    } else {
        htmlEl.setAttribute('lang', 'en');
        htmlEl.setAttribute('dir', 'ltr');
        updatePlaceholders('en');
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentDir = htmlEl.getAttribute('dir');
            if (currentDir === 'ltr') {
                htmlEl.setAttribute('lang', 'ar');
                htmlEl.setAttribute('dir', 'rtl');
                localStorage.setItem('portfolio_lang', 'ar');
                updatePlaceholders('ar');
            } else {
                htmlEl.setAttribute('lang', 'en');
                htmlEl.setAttribute('dir', 'ltr');
                localStorage.setItem('portfolio_lang', 'en');
                updatePlaceholders('en');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
            }
        });
    });

    // 3. Header Scroll Effect & Active Page Highlighting
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const currentFile = pathParts[pathParts.length - 1] || 'index.html';

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        if (linkHref === currentFile || (currentFile === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 4. Typing Animation Data (For Hero)
    const typingSpanEn = document.querySelector('.type-target-en');
    const typingSpanAr = document.querySelector('.type-target-ar');
    
    const wordsEn = ["Doctors.", "Engineers.", "Creatives.", "Founders.", "Anyone."];
    const wordsAr = ["الأطباء.", "المهندسين.", "المبدعين.", "المؤسسين.", "الجميع."];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typingSpanEn && !typingSpanAr) return;

        const isRtl = htmlEl.getAttribute('dir') === 'rtl';
        const currentWords = isRtl ? wordsAr : wordsEn;
        const currentTarget = isRtl ? typingSpanAr : typingSpanEn;
        
        // Hide the non-active target quickly
        if(isRtl && typingSpanEn) typingSpanEn.textContent = '';
        if(!isRtl && typingSpanAr) typingSpanAr.textContent = '';

        if (!currentTarget) return;

        const currentWord = currentWords[wordIndex];

        if (isDeleting) {
            currentTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % currentWords.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect immediately
    if(typingSpanEn || typingSpanAr) {
        setTimeout(typeEffect, 1000);
    }

    // 5. GSAP Animations Integration
    // Check if GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Smooth reveal for sections
        const sections = document.querySelectorAll('.section');
        sections.forEach((sec) => {
            gsap.fromTo(sec, 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sec,
                        start: "top 85%",
                    }
                }
            );
        });

        // Staggered reveal for cards
        const staggerGroups = document.querySelectorAll('.card-grid, .stats-container, .bento-grid, .timeline');
        staggerGroups.forEach((group) => {
            const children = group.children;
            gsap.fromTo(children, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 85%",
                    }
                }
            );
        });

        // Parallax & Scale for majestic mockup in hero
        const mockup = document.querySelector('.mockup-container');
        if (mockup) {
            gsap.fromTo(mockup,
                { scale: 0.95, opacity: 0.8 },
                {
                    scale: 1,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "top top",
                        end: "bottom center",
                        scrub: 1
                    }
                }
            );
        }
    } else {
        // Fallback for elements if GSAP fails to load (Intersection Observer)
        console.warn('GSAP not loaded. Using fallback reveals.');
        const revealElements = document.querySelectorAll('.card-grid > *, .bento-grid > *, .stats-container > *, .timeline > *');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            revealObserver.observe(el);
        });
    }

    // 6. Form Validation
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const parent = input.closest('.input-control');
                if (!input.value.trim()) {
                    parent.classList.add('error');
                    isValid = false;
                } else {
                    parent.classList.remove('error');
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            parent.classList.add('error');
                            isValid = false;
                        }
                    }
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const ogText = submitBtn.innerHTML;
                
                const isRtl = htmlEl.getAttribute('dir') === 'rtl';
                submitBtn.innerHTML = isRtl ? 'جاري الإرسال...' : 'Sending...';
                
                setTimeout(() => {
                    formSuccessMessage.classList.remove('hidden');
                    contactForm.reset();
                    submitBtn.innerHTML = ogText;
                    
                    setTimeout(() => {
                        formSuccessMessage.classList.add('hidden');
                    }, 5000);
                }, 1500);
            }
        });

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.closest('.input-control').classList.remove('error');
            });
        });
    }

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
