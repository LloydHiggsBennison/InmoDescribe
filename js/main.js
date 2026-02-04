// PropiedadIA - Main JS (Landing Page)
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards, pricing cards, testimonials
    document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Typing effect for hero card
    const typingElement = document.querySelector('.typing-effect p');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typingElement.textContent = '';
        let index = 0;

        function typeChar() {
            if (index < originalText.length) {
                typingElement.textContent += originalText[index];
                index++;
                setTimeout(typeChar, 20);
            }
        }

        // Start typing after a delay
        setTimeout(typeChar, 1000);
    }

    // ========================================
    // DEMO SECTION FUNCTIONALITY
    // ========================================
    const demoBtn = document.getElementById('demoGenerateBtn');
    const demoResult = document.getElementById('demoResult');
    const demoCopyBtn = document.getElementById('demoCopyBtn');

    if (demoBtn && demoResult) {
        demoBtn.addEventListener('click', async () => {
            const propertyType = document.getElementById('demoType')?.value || 'departamento';
            const rooms = document.getElementById('demoRooms')?.value || '3';
            const baths = document.getElementById('demoBaths')?.value || '2';
            const size = document.getElementById('demoSize')?.value || '85';
            const features = document.getElementById('demoFeatures')?.value || '';

            // Loading state
            demoBtn.disabled = true;
            demoBtn.innerHTML = '<div class="spinner"></div> Generando...';
            demoResult.innerHTML = '<p class="placeholder-text">✨ Generando descripción con IA...</p>';

            // Simulate AI generation with realistic demo
            await new Promise(r => setTimeout(r, 2000));

            const descriptions = [
                `🏡 ¡Increíble ${propertyType} de ${size}m² en excelente ubicación!\n\nCuenta con ${rooms} amplias habitaciones con luz natural abundante y ${baths} modernos baños completamente equipados.\n\n✨ Características destacadas:\n${features ? features : '• Terminaciones de primera calidad\n• Excelente conectividad\n• Espacios amplios y luminosos'}\n\nUna oportunidad única para quienes buscan comodidad y calidad de vida. ¡No te lo pierdas!\n\n📞 Agenda tu visita hoy mismo.`,

                `✨ Espectacular ${propertyType} de ${size}m² que te enamorará desde el primer momento.\n\nEste increíble espacio ofrece ${rooms} dormitorios perfectamente diseñados y ${baths} baños de lujo con terminaciones premium.\n\n🌟 Lo que hace única esta propiedad:\n${features ? features : '• Diseño moderno y funcional\n• Ubicación privilegiada\n• Excelente inversión'}\n\n¡Una joya inmobiliaria que no puedes dejar pasar! Perfecta para familias que valoran la calidad.\n\n🔑 ¿Te interesa? Contáctanos ahora.`,

                `🌟 ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} de ensueño - ${size}m² de puro confort\n\nDescubre este magnífico espacio con ${rooms} habitaciones diseñadas para el descanso perfecto y ${baths} baños con acabados de primera.\n\n💎 Puntos destacados:\n${features ? features : '• Arquitectura moderna\n• Ambientes luminosos\n• Sectores exclusivos'}\n\nIdeal para quienes buscan un hogar con personalidad y estilo. ¡Esta es TU oportunidad!\n\n📍 Visítanos y enamórate.`
            ];

            const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
            demoResult.innerHTML = `<p>${randomDescription.replace(/\n/g, '<br>')}</p>`;

            // Reset button
            demoBtn.disabled = false;
            demoBtn.innerHTML = `
                <span>Generar Descripción</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
            `;
        });
    }

    // Copy demo result
    if (demoCopyBtn && demoResult) {
        demoCopyBtn.addEventListener('click', () => {
            const text = demoResult.innerText;
            if (text && text !== 'Tu descripción aparecerá aquí...') {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = demoCopyBtn.innerHTML;
                    demoCopyBtn.innerHTML = '✓ Copiado';
                    setTimeout(() => {
                        demoCopyBtn.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
    }
});

