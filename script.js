

// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    let currentHeaderTheme = 'light'; // Default

    // --- THREE.JS HERO ANIMATION ---
    const container = document.getElementById('canvas-container');
    if (container) {
        const scene = new THREE.Scene();
        // Fog shifted to a soft emerald gradient hint (closer to text gradient)
        scene.fog = new THREE.FogExp2(0xE8F7E0, 0.002); // warmer mint, menos azul

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        camera.position.y = 10;
        camera.rotation.x = -0.2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const planeGeometry = new THREE.PlaneGeometry(120, 120, 40, 40);

        // Vertex colors for multi-green gradient (sea flag effect)
        const seaColorStart = new THREE.Color('#3c8d3f');
        const seaColorEnd = new THREE.Color('#01b41d');
        const seaColors = [];
        for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
            const x = planeGeometry.attributes.position.getX(i);
            const t = (x + 60) / 120; // normalize -60..60 to 0..1
            const c = seaColorStart.clone().lerp(seaColorEnd, t);
            seaColors.push(c.r, c.g, c.b);
        }
        planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(seaColors, 3));

        const planeMaterial = new THREE.MeshBasicMaterial({
            vertexColors: true,
            wireframe: true,
            transparent: true,
            opacity: 0.14, // Softer presence with reduced brightness
        });

        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        scene.add(planeMesh);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = planeGeometry.attributes.position.count;
        const particlePositions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            particlePositions[i] = planeGeometry.attributes.position.array[i];
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(seaColors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            size: 0.22,
            transparent: true,
            opacity: 0.45
        });
        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        particleMesh.rotation.x = -Math.PI / 2;
        scene.add(particleMesh);

        let time = 0;
        const originalPositions = planeGeometry.attributes.position.array.slice();

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            const positions = planeGeometry.attributes.position.array;
            const ptPositions = particlesGeometry.attributes.position.array;

            for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];
                const z = Math.sin(x * 0.2 + time) * 1.5 + Math.cos(y * 0.15 + time) * 1.5;

                positions[i * 3 + 2] = z;
                ptPositions[i * 3 + 2] = z;
            }

            planeGeometry.attributes.position.needsUpdate = true;
            particlesGeometry.attributes.position.needsUpdate = true;

            planeMesh.rotation.z = time * 0.02;
            particleMesh.rotation.z = time * 0.02;

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Trigger initial Hero animations
        setTimeout(() => {
            const heroAnims = document.querySelectorAll('.hero-anim');
            heroAnims.forEach(el => {
                el.classList.remove('opacity-0', 'translate-y-12');
                el.classList.add('opacity-100', 'translate-y-0');
            });
            const scrollInd = document.querySelector('.hero-scroll');
            if (scrollInd) scrollInd.classList.replace('opacity-0', 'opacity-50');
        }, 100);
    }

    // --- SYNAPTIC WEB ANIMATION ---
    const synapticCanvas = document.getElementById('synaptic-canvas');
    if (synapticCanvas) {
        initSynapticWeb(synapticCanvas);
    }

    // --- SCROLL OBSERVATION ---
    const observerOptions = { threshold: 0.15 };
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const anims = entry.target.querySelectorAll('.fade-anim');
                anims.forEach(anim => {
                    anim.classList.remove('opacity-0', '-translate-x-10', 'translate-x-10', '-translate-x-12', 'translate-x-12', 'translate-y-10');
                    anim.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
                });
                animObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-anim').forEach(section => {
        animObserver.observe(section);
    });

    // --- HEADER THEME OBSERVATION ---
    const header = document.getElementById('main-header');
    const headerContainer = document.getElementById('header-container');
    const logoIcon = document.getElementById('logo-icon-container');
    const logoText = document.getElementById('logo-text');
    const logoSubtitle = document.getElementById('logo-subtitle');
    const logoImg = document.getElementById('logo-img');
    const navTexts = document.querySelectorAll('.nav-item-text');
    const mobileToggle = document.getElementById('mobile-toggle');

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.getAttribute('data-header-theme');
                updateHeaderTheme(theme);
            }
        });
    }, {
        rootMargin: '-50px 0px -90% 0px'
    });

    document.querySelectorAll('section[data-header-theme], footer[data-header-theme]').forEach(el => {
        themeObserver.observe(el);
    });

    function updateHeaderTheme(theme) {
        currentHeaderTheme = theme;

        if (theme === 'dark') {
            // THEME: "Dark" (Header text is Dark, Background is Light)
            // Use Main Logo (Green)

            logoText.classList.remove('text-white');
            logoText.classList.add('text-prosper-dark');

            logoSubtitle.classList.remove('text-prosper-accent');
            logoSubtitle.classList.add('text-prosper-slate');

            logoImg.src = 'assets/images/owl_green.svg';

            navTexts.forEach(t => {
                t.classList.remove('text-gray-300', 'hover:text-white', 'text-gray-400');
                t.classList.add('text-prosper-dark', 'hover:text-prosper-accent');
            });

            // Update mobile toggle color
            mobileToggle.classList.remove('text-white', 'hover:bg-white/5');
            mobileToggle.classList.add('text-prosper-dark', 'hover:bg-black/5');

        } else {
            // THEME: "Light" (Header text is Light, Background is Dark)
            // Use Secondary Logo (White)

            logoText.classList.add('text-white');
            logoText.classList.remove('text-prosper-dark');

            logoSubtitle.classList.add('text-prosper-accent');
            logoSubtitle.classList.remove('text-prosper-slate');

            logoImg.src = 'assets/images/owl_white.svg';

            navTexts.forEach(t => {
                t.classList.add('text-gray-300', 'hover:text-white');
                t.classList.remove('text-prosper-dark', 'hover:text-prosper-accent');
            });

            // Update mobile toggle color
            mobileToggle.classList.add('text-white', 'hover:bg-white/5');
            mobileToggle.classList.remove('text-prosper-dark', 'hover:bg-black/5');
        }
    }


    // --- HEADER SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('header-scrolled');
            headerContainer.classList.add('header-container-scrolled');
            headerContainer.classList.remove('bg-transparent', 'w-full', 'py-6', 'px-8', 'md:px-12');

            // Resize large icon down
            logoIcon.classList.replace('w-14', 'w-10');
            logoIcon.classList.replace('h-14', 'h-10');

            logoText.classList.replace('text-lg', 'text-sm');

        } else {
            header.classList.remove('header-scrolled');
            headerContainer.classList.remove('header-container-scrolled');
            headerContainer.classList.add('bg-transparent', 'w-full', 'py-6', 'px-8', 'md:px-12');

            // Restore large icon
            logoIcon.classList.replace('w-10', 'w-14');
            logoIcon.classList.replace('h-10', 'h-14');

            logoText.classList.replace('text-sm', 'text-lg');
        }
    });

    // --- MOBILE MENU ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileDivider = document.getElementById('mobile-divider');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    let isMenuOpen = false;

    mobileToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        toggleMobileMenu(isMenuOpen);
    });

    function toggleMobileMenu(open) {
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            // APPLY DYNAMIC THEME BASED ON SECTION
            if (currentHeaderTheme === 'dark') {
                // Light Background: Menu should be Light with Dark Text
                mobileMenu.classList.remove('bg-prosper-dark/98', 'text-white');
                mobileMenu.classList.add('bg-gray-50/98', 'text-prosper-dark');

                mobileLinks.forEach(link => {
                    link.classList.remove('text-white/90');
                    link.classList.add('text-prosper-dark');
                });

                mobileToggle.classList.remove('text-white');
                mobileToggle.classList.add('text-prosper-dark');

            } else {
                // Dark Background: Menu should be Dark with White Text
                mobileMenu.classList.add('bg-prosper-dark/98', 'text-white');
                mobileMenu.classList.remove('bg-gray-50/98', 'text-prosper-dark');

                mobileLinks.forEach(link => {
                    link.classList.add('text-white/90');
                    link.classList.remove('text-prosper-dark');
                });

                mobileToggle.classList.add('text-white');
                mobileToggle.classList.remove('text-prosper-dark');
            }

            // SHOW MENU
            mobileMenu.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'visible');

            iconMenu.classList.replace('opacity-100', 'opacity-0');
            iconMenu.classList.replace('rotate-0', 'rotate-90');
            iconMenu.classList.replace('scale-100', 'scale-0');

            iconClose.classList.replace('opacity-0', 'opacity-100');
            iconClose.classList.replace('rotate-90', 'rotate-0');
            iconClose.classList.replace('scale-0', 'scale-100');

            mobileLinks.forEach((link, idx) => {
                setTimeout(() => {
                    link.classList.remove('translate-y-8', 'opacity-0', 'blur-sm');
                    link.classList.add('translate-y-0', 'opacity-100', 'blur-0');
                }, idx * 100);
            });
            setTimeout(() => {
                mobileDivider.classList.replace('scale-x-100', 'scale-x-100');
            }, mobileLinks.length * 100);

        } else {
            // HIDE MENU
            mobileMenu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'visible');

            iconMenu.classList.replace('opacity-0', 'opacity-100');
            iconMenu.classList.replace('rotate-90', 'rotate-0');
            iconMenu.classList.replace('scale-0', 'scale-100');

            iconClose.classList.replace('opacity-100', 'opacity-0');
            iconClose.classList.replace('rotate-0', 'rotate-90');
            iconClose.classList.replace('scale-100', 'scale-0');

            mobileLinks.forEach(link => {
                link.classList.add('translate-y-8', 'opacity-0', 'blur-sm');
                link.classList.remove('translate-y-0', 'opacity-100', 'blur-0');
            });
            mobileDivider.classList.replace('scale-x-100', 'scale-x-0');

            if (currentHeaderTheme === 'dark') {
                mobileToggle.classList.remove('text-white');
                mobileToggle.classList.add('text-prosper-dark');
            } else {
                mobileToggle.classList.add('text-white');
                mobileToggle.classList.remove('text-prosper-dark');
            }
        }
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            toggleMobileMenu(false);
        });
    });

    // --- RIDDLE FLIP LOGIC ---
    const riddleBtnFlip = document.getElementById('riddle-btn-flip');
    const riddleBtnBack = document.getElementById('riddle-btn-back');
    const riddleCard = document.getElementById('riddle-card-container');

    if (riddleBtnFlip && riddleCard) {
        riddleBtnFlip.addEventListener('click', (e) => {
            e.preventDefault();
            if (!riddleCard.classList.contains('flipped')) {
                riddleCard.classList.add('flipped');
            }
        });
    }

    if (riddleBtnBack && riddleCard) {
        riddleBtnBack.addEventListener('click', (e) => {
            e.preventDefault();
            if (riddleCard.classList.contains('flipped')) {
                riddleCard.classList.remove('flipped');
            }
        });
    }

    // --- PROJECTS TABS ---
    const tabs = document.querySelectorAll('.tab-btn');
    const audienceInput = document.getElementById('audience-input');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-prosper-dark', 'text-prosper-accent', 'shadow-lg', 'transform', 'scale-105');
                t.classList.add('bg-gray-100', 'text-gray-500', 'hover:bg-gray-200');
            });
            tab.classList.add('active', 'bg-prosper-dark', 'text-prosper-accent', 'shadow-lg', 'transform', 'scale-105');
            tab.classList.remove('bg-gray-100', 'text-gray-500', 'hover:bg-gray-200');
            if (audienceInput) {
                audienceInput.value = tab.dataset.tab || '';
            }
        });
    });

    // --- FORM HANDLING ---
    const form = document.getElementById('waitlist-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnIcon = document.getElementById('btn-icon');
    const emailInput = document.getElementById('email-input');
    const feedback = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!emailInput.value || submitBtn.disabled) return;

            btnIcon.setAttribute('data-lucide', 'loader-2');
            btnIcon.classList.add('animate-spin');
            submitBtn.disabled = true;
            lucide.createIcons();

            if (feedback) feedback.textContent = '';

            try {
                const formData = new FormData(form);
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                btnIcon.classList.remove('animate-spin');
                btnIcon.setAttribute('data-lucide', 'check');
                submitBtn.classList.remove('bg-prosper-accent', 'text-prosper-dark');
                submitBtn.classList.add('bg-green-500', 'text-white', 'w-12', 'px-0');
                emailInput.value = '';
                lucide.createIcons();

                if (feedback) {
                    feedback.textContent = res.ok
                        ? '¡Gracias! Te avisaremos cuando abramos el acceso.'
                        : 'No se pudo enviar. Por favor, inténtalo de nuevo en un momento.';
                }

                setTimeout(() => {
                    btnIcon.setAttribute('data-lucide', 'arrow-right');
                    submitBtn.classList.add('bg-prosper-accent', 'text-prosper-dark');
                    submitBtn.classList.remove('bg-green-500', 'text-white', 'w-12', 'px-0');
                    submitBtn.disabled = false;
                    lucide.createIcons();
                }, 2500);
            } catch (error) {
                btnIcon.classList.remove('animate-spin');
                btnIcon.setAttribute('data-lucide', 'alert-circle');
                submitBtn.disabled = false;
                lucide.createIcons();
                if (feedback) {
                    feedback.textContent = 'Error de conexión. Revisa tu red y vuelve a intentar.';
                }
            }
        });
    }

    // --- CONTACT FORM (uses same Formspree endpoint) ---
    const contactForm = document.getElementById('contact-form');
    const contactSubmit = document.getElementById('contact-submit');
    const contactIcon = document.getElementById('contact-btn-icon');
    const contactBtnText = document.getElementById('contact-btn-text');
    const contactFeedback = document.getElementById('contact-feedback');
    if (contactForm && contactSubmit && contactIcon) {
        const contactDefaultClasses = contactSubmit.className;
        const resetContactButton = () => {
            contactSubmit.className = contactDefaultClasses;
            contactIcon.className = 'w-4 h-4';
            contactIcon.classList.remove('animate-spin');
            contactIcon.setAttribute('data-lucide', 'send');
            if (contactBtnText) contactBtnText.textContent = 'Enviar mensaje';
            contactSubmit.disabled = false;
            lucide.createIcons();
        };
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (contactSubmit.disabled) return;

            contactIcon.setAttribute('data-lucide', 'loader-2');
            contactIcon.classList.add('animate-spin');
            if (contactBtnText) contactBtnText.textContent = 'Enviando...';
            contactSubmit.disabled = true;
            lucide.createIcons();
            if (contactFeedback) contactFeedback.textContent = '';

            try {
                const data = new FormData(contactForm);
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { Accept: 'application/json' }
                });

                contactIcon.classList.remove('animate-spin');
                contactForm.reset();
                if (contactFeedback) {
                    contactFeedback.textContent = res.ok
                        ? '¡Gracias! Hemos recibido tu mensaje.'
                        : 'No se pudo enviar. Inténtalo de nuevo en un momento.';
                }

                // Restore button to original state immediately
                resetContactButton();
            } catch (err) {
                contactIcon.classList.remove('animate-spin');
                contactIcon.setAttribute('data-lucide', 'alert-circle');
                contactSubmit.disabled = false;
                lucide.createIcons();
                if (contactFeedback) contactFeedback.textContent = 'Error de conexión. Revisa tu red y vuelve a intentar.';
                if (contactBtnText) contactBtnText.textContent = 'Enviar mensaje';
            }
        });
    }
});

// --- SYNAPTIC WEB LOGIC ---
function initSynapticWeb(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    // Nodes
    const nodes = [];
    const nodeCount = 60;
    let anchors = [];
    const mouse = { x: null, y: null };

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(132, 204, 22, 0.3)'; // Lime Green
            ctx.fill();
        }
    }

    function resize() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        nodes.length = 0;
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        updateAnchors();
    }

    function updateAnchors() {
        anchors = [];
        const elements = document.querySelectorAll('.synaptic-anchor');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const sectionRect = canvas.getBoundingClientRect();
            anchors.push({
                x: rect.left - sectionRect.left + (rect.width / 2),
                y: rect.top - sectionRect.top + (rect.height / 2)
            });
        });
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(node => {
            node.update();
            node.draw();

            nodes.forEach(otherNode => {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.strokeStyle = `rgba(132, 204, 22, ${0.1 - dist / 1000})`; // Lime
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            anchors.forEach(anchor => {
                const dx = node.x - anchor.x;
                const dy = node.y - anchor.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(anchor.x, anchor.y);
                    ctx.strokeStyle = `rgba(132, 204, 22, ${0.4 - dist / 400})`; // Lime
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', updateAnchors);
    animate();
}

window.scrollToId = function (id) {
    const el = document.getElementById(id);
    if (el) {
        const headerOffset = 0;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToId(targetId);
    });
});
