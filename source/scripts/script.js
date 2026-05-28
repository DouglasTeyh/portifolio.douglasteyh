document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Animações GSAP
    initEpicDeveloperAnimations();
});

/* --- LOGICA DE ANIMAÇÕES GSAP --- */
function initEpicDeveloperAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn("GSAP não está definido. Verifique as importações de CDN.");
        return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Hero Timeline ---
    if (document.querySelector(".epic-hero-section")) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".gs-reveal-hero",
            { scale: 0.85, autoAlpha: 0, rotation: -2 },
            { scale: 1, autoAlpha: 1, rotation: 0, duration: 1.0 }
        )
        .fromTo(".gs-reveal-text",
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12 },
            "-=0.4"
        )
        .fromTo(".gs-reveal-hero-btn",
            { y: 20, autoAlpha: 0 },
            { 
                y: 0, 
                autoAlpha: 1, 
                duration: 0.5,
                onComplete: () => {
                    gsap.set(".gs-reveal-hero-btn", { clearProps: "transform,opacity" });
                }
            },
            "-=0.3"
        );
    }

    // --- Animação de Scroll (Revelação Up) ---
    gsap.utils.toArray('.gs-reveal-up').forEach(elem => {
        gsap.fromTo(elem,
            { y: 0, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 92%",
                    toggleActions: "play none none none"
                },
                onComplete: () => {
                    elem.classList.add('animated-done');
                    gsap.set(elem, { clearProps: "transform,opacity" });
                }
            }
        );
    });

    // --- Projects Grid Scroll Reveal (Staggered) ---
    if (document.querySelector(".epic-projects-grid")) {
        gsap.fromTo(".epic-projects-grid .epic-project-card",
            { y: 0, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".epic-projects-grid",
                    start: "top 88%",
                    toggleActions: "play none none none"
                },
                onComplete: () => {
                    const cards = document.querySelectorAll(".epic-projects-grid .epic-project-card");
                    cards.forEach(card => {
                        card.classList.add('animated-done');
                        gsap.set(card, { clearProps: "transform,opacity" });
                    });
                }
            }
        );
    }

    // --- Efeito Crypto Scramble (Embaralhamento de Texto) ---
    window.applyCryptoScramble = function (elem) {
        if (!elem || elem.classList.contains('scrambled-done')) return;

        // Medir dimensões originais antes de qualquer modificação para travar o layout
        const rect = elem.getBoundingClientRect();
        const originalWidth = rect.width;
        const originalHeight = rect.height;
        const originalDisplay = window.getComputedStyle(elem).display;

        if (!elem.hasAttribute('data-crypto')) {
            elem.setAttribute('data-crypto', elem.innerHTML);
        }
        const originalHTML = elem.getAttribute('data-crypto');

        const textNodes = [];
        const walk = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while (n = walk.nextNode()) {
            if (n.nodeValue.trim() !== '') {
                textNodes.push({ node: n, originalText: n.nodeValue });
            }
        }

        if (textNodes.length === 0) return;
        elem.classList.add('scrambled-done');

        // Travar dimensões e propriedades CSS do elemento para impedir reflow
        const isInline = originalDisplay === 'inline' || originalDisplay === 'inline-block';
        elem.style.width = `${originalWidth}px`;
        elem.style.height = `${originalHeight}px`;
        if (isInline) {
            elem.style.display = 'inline-block';
        }
        elem.style.whiteSpace = 'nowrap';
        elem.style.overflow = 'hidden';

        const chars = '!<>-_\\/[]{}—=+*^?#_010101';
        let iterations = 0;
        const maxIterations = 20;

        const interval = setInterval(() => {
            textNodes.forEach(item => {
                let scrambled = '';
                for (let i = 0; i < item.originalText.length; i++) {
                    if (item.originalText[i] === ' ' || item.originalText[i] === '\n') {
                        scrambled += item.originalText[i];
                        continue;
                    }
                    if (iterations > maxIterations * (i / item.originalText.length)) {
                        scrambled += item.originalText[i];
                    } else {
                        scrambled += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                item.node.nodeValue = scrambled;
            });

            iterations++;
            if (iterations > maxIterations) {
                clearInterval(interval);
                elem.innerHTML = originalHTML;
                
                // Limpar estilos de trava de layout
                elem.style.width = '';
                elem.style.height = '';
                elem.style.display = '';
                elem.style.whiteSpace = '';
                elem.style.overflow = '';
            }
        }, 40);
    };

    const cryptoSelectors = [
        '.epic-title', '.glass-title', '.showcase-title',
        '.epic-section-title', '.showcase-subtitle',
        '.epic-project-title', '.projects-section-title'
    ].join(', ');

    gsap.utils.toArray(cryptoSelectors).forEach(elem => {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 95%",
            onEnter: () => window.applyCryptoScramble(elem),
            onLeaveBack: () => elem.classList.remove('scrambled-done')
        });
    });

    // --- Efeito Mouse Glow (Rastro de Luz) ---
    const devContainer = document.querySelector('.epic-dev-container');
    if (devContainer) {
        let cursorGlow = devContainer.querySelector('.cursor-glow');
        if (!cursorGlow) {
            cursorGlow = document.createElement('div');
            cursorGlow.className = 'cursor-glow';
            devContainer.appendChild(cursorGlow);
        }

        devContainer.addEventListener('mousemove', (e) => {
            gsap.to(cursorGlow, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power3.out"
            });
        });

        devContainer.addEventListener('mouseenter', () => gsap.to(cursorGlow, { opacity: 0.8, duration: 0.3 }));
        devContainer.addEventListener('mouseleave', () => gsap.to(cursorGlow, { opacity: 0, duration: 0.3 }));
        gsap.to(cursorGlow, { opacity: 0.8, duration: 0.5, delay: 0.5 });
    }

    // --- Stagger Grid Social Cards ---
    if (document.querySelector(".epic-social-grid")) {
        gsap.fromTo(".gs-reveal-stagger",
            { scale: 0.92, autoAlpha: 0, y: 0 },
            {
                scale: 1, autoAlpha: 1, y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: ".epic-social-grid",
                    start: "top 90%"
                },
                onComplete: () => {
                    const cards = document.querySelectorAll(".gs-reveal-stagger");
                    cards.forEach(card => {
                        card.classList.add('animated-done');
                        gsap.set(card, { clearProps: "transform,opacity" });
                    });
                }
            }
        );
    }

    // --- Efeito Magnetic Buttons (Botões Magnéticos Premium) ---
    const magneticElements = document.querySelectorAll('.epic-btn');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // Atualizar ScrollTrigger em intervalos para evitar inconsistências
    setTimeout(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh(), 100);
    setTimeout(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh(), 500);
    setTimeout(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh(), 2000);
}