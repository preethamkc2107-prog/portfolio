document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       Theme Toggle System
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Save choice in localStorage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
        
        // Re-run lucide icons creation just in case
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    /* ==========================================================================
       Mobile Navigation Menu
       ========================================================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('overflow-hidden');
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       Sticky Header and Active Link Observer
       ========================================================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header Class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // Active link highlighting using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    /* ==========================================================================
       Typewriter Effect
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const roles = ['AI & Data Science Student', 'Machine Learning Specialist', 'Data Scientist', 'Python Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Type slower
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full string
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next role
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typewriterElement) {
        typeEffect();
    }

    /* ==========================================================================
       Projects Filter Logic
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add class transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       Projects Details Modal Lightbox
       ========================================================================== */
    const projectsData = {
        neuroscan: {
            title: "NeuroScan MRI Classifier",
            tag: "Computer Vision / Deep Learning",
            desc: "NeuroScan is a deep learning computer vision pipeline designed to classify and segment brain tumors from MRI scans. It trains custom Convolutional Neural Networks (CNNs) in PyTorch, highlighting tumor regions using Grad-CAM heatmaps on a responsive web dashboard.",
            img: "assets/project-neuroscan.png",
            features: [
                "ResNet-based CNN classifier achieving 96.4% testing accuracy",
                "Grad-CAM integration for explainable AI showing model focus areas",
                "Fast DICOM to PNG converter library for fast user MRI uploads",
                "Interactive dashboard displaying feature activation maps"
            ],
            tech: ["Python", "PyTorch", "OpenCV", "Flask", "React", "Docker"],
            demo: "https://github.com",
            code: "https://github.com"
        },
        sentilytics: {
            title: "Sentilytics Dashboard",
            tag: "Natural Language Processing",
            desc: "Sentilytics is a real-time natural language processing dashboard designed to ingest streaming feeds and forecast sentiment patterns. It leverages fine-tuned BERT transformer models to analyze sentence context, tracking rolling sentiment indices on interactive time-series plots.",
            img: "assets/project-sentiment.png",
            features: [
                "Fine-tuned DistilBERT classifier for 3-way sentiment classification",
                "Kafka stream ingestion pipeline processing up to 500 records per second",
                "Dynamic SVG visualizations with interactive D3.js timelines",
                "Automated PDF report generation capturing sentiment shifts"
            ],
            tech: ["Python", "Transformers", "BERT", "FastAPI", "Kafka", "D3.js"],
            demo: "https://github.com",
            code: "https://github.com"
        },
        optiroute: {
            title: "OptiRoute RL Simulator",
            tag: "Reinforcement Learning",
            desc: "OptiRoute is an intelligent simulation environment that models urban intersections and optimizes traffic light phases using reinforcement learning. It trains Deep Q-Network (DQN) agents to adjust signal phases based on queue lengths, minimizing vehicle wait times by up to 35%.",
            img: "assets/project-traffic.png",
            features: [
                "Custom Gym-based environment simulating dynamic traffic flow",
                "DQN and Proximal Policy Optimization (PPO) reinforcement learning agents",
                "Real-time render canvas displaying vehicle movements and traffic lights",
                "Interactive dashboard tracking policy reward convergence metrics"
            ],
            tech: ["Python", "Stable-Baselines3", "Gymnasium", "Pygame", "FastAPI", "Chart.js"],
            demo: "https://github.com",
            code: "https://github.com"
        }
    };

    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-project-img');
    const modalPlaceholder = document.getElementById('modal-project-gradient');
    const modalTag = document.getElementById('modal-project-tag');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalFeaturesList = document.getElementById('modal-project-features');
    const modalTechBadges = document.getElementById('modal-project-tech');
    const modalBtnDemo = document.getElementById('modal-btn-demo');
    const modalBtnCode = document.getElementById('modal-btn-code');
    
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = modal.querySelector('.modal-backdrop');

    const openModal = (projectId) => {
        const data = projectsData[projectId];
        if (!data) return;

        // Image or gradient toggle
        if (data.img) {
            modalImg.src = data.img;
            modalImg.alt = `${data.title} screenshot`;
            modalImg.classList.add('active');
            modalPlaceholder.classList.remove('active');
        } else {
            modalImg.classList.remove('active');
            modalPlaceholder.className = `project-gradient-placeholder ${data.gradientClass || 'bg-gradient-1'} active`;
            
            const modalIcon = modalPlaceholder.querySelector('.placeholder-icon');
            const modalPlaceholderText = modalPlaceholder.querySelector('.placeholder-text');
            if (modalIcon && data.icon) {
                modalIcon.setAttribute('data-lucide', data.icon);
            }
            if (modalPlaceholderText) {
                modalPlaceholderText.textContent = data.title;
            }
        }

        // Fill Text & Info
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        // Fill features
        modalFeaturesList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            modalFeaturesList.appendChild(li);
        });

        // Fill tech badges
        modalTechBadges.innerHTML = '';
        data.tech.forEach(techName => {
            const span = document.createElement('span');
            span.className = 'tech-badge';
            span.textContent = techName;
            modalTechBadges.appendChild(span);
        });

        // Update links
        modalBtnDemo.href = data.demo;
        modalBtnCode.href = data.code;

        // Open modal
        modal.classList.add('active');
        body.classList.add('overflow-hidden');
        modal.setAttribute('aria-hidden', 'false');

        // Reinitialize icons in modal if loaded
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        body.classList.remove('overflow-hidden');
        modal.setAttribute('aria-hidden', 'true');
    };

    // Attach click listeners to project card view details buttons
    projectCards.forEach(card => {
        const btn = card.querySelector('.view-details-btn');
        const id = card.getAttribute('data-id');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid card bubble clicks
            openModal(id);
        });

        // Allow clicking the entire card to open details
        card.addEventListener('click', () => {
            openModal(id);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Escape Key to Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    const submitIcon = document.getElementById('submit-icon');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.querySelector('span').textContent;
            submitBtn.querySelector('span').textContent = 'Sending...';
            
            if (submitIcon) {
                submitIcon.setAttribute('data-lucide', 'loader');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                submitIcon.classList.add('spinning');
            }

            // Simulate server network request delay
            setTimeout(() => {
                // Success path
                formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                formFeedback.className = "form-feedback-message success";
                
                // Reset form fields
                contactForm.reset();

                // Reset button states
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalBtnText;
                
                if (submitIcon) {
                    submitIcon.setAttribute('data-lucide', 'send');
                    submitIcon.classList.remove('spinning');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }

                // Hide feedback message after 5 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);

            }, 1500);
        });
    }
});
