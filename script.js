
 /*
===================================================
   Heaven Hotel Mbale JavaScript
   Functions:
   1. Copyright Year Update
   2. Mobile Menu Toggle
   3. Page Routing/Switching (SPA behavior)
   4. Scroll-based Fade-in Animations
   5. Modal (Menu) Logic
   6. Gallery Lightbox Logic
   7. Contact Form Logic
===================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Update Copyright Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // --- 3. Page Routing/Switching (Simple SPA) ---
    const pageSections = document.querySelectorAll('.page-section');
    const navLinksList = document.querySelectorAll('.nav-link');

    const setActivePage = (pageId) => {
        let targetId = pageId;

        // Fallback for initial load
        if (!targetId || targetId === '#') {
            targetId = '#home';
        }
        
        // Ensure ID is clean (e.g., '#services' -> 'services-page')
        const targetSectionId = targetId.slice(1) + '-page';

        // 1. Hide all pages and remove active class from nav
        pageSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
            // Remove previous scroll animations to re-trigger them later
            section.querySelectorAll('.fade-in-section').forEach(el => el.classList.remove('is-visible'));
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
        });

        // 2. Show target page and set active class on nav
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            // Timeout to allow display:block to take effect before opacity change
            setTimeout(() => {
                targetSection.classList.add('active');
                // Re-observe elements for fade-in animation
                targetSection.querySelectorAll('.fade-in-section').forEach(el => {
                    appearOnScroll.observe(el);
                });
                window.scrollTo(0, 0); // Scroll to top of the new page
            }, 10);
        }
        
        // 3. Update navigation active state
        const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // 4. Close mobile menu if open
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    };

    // Handle initial load and hash changes
    const currentHash = window.location.hash || '#home';
    setActivePage(currentHash);

    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href');
            window.history.pushState(null, '', pageId); // Update URL hash
            setActivePage(pageId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        setActivePage(window.location.hash);
    });
    
    // --- 4. Scroll-based Fade-in Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in-section');

    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    // Initial observation (Only for elements on the initially visible page)
    document.querySelectorAll('#home-page .fade-in-section').forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 5. Modal (Menu) Logic ---
    const menuModal = document.getElementById("menuModal");
    const openMenuBtn = document.getElementById("openMenuBtn");
    
    if (openMenuBtn) {
        openMenuBtn.onclick = function() {
            menuModal.style.display = "block";
        }
    }

    // --- 6. Gallery Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.caption-overlay').textContent;
            
            lightbox.style.display = 'block';
            lightboxImage.src = img.src;
            lightboxCaption.textContent = caption;
        });
    });

    // Close Modals/Lightbox Logic
    document.querySelectorAll('.close-btn').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            menuModal.style.display = "none";
            lightbox.style.display = "none";
        });
    });

    window.onclick = function(event) {
      if (event.target == menuModal) {
        menuModal.style.display = "none";
      }
      if (event.target == lightbox) {
        lightbox.style.display = "none";
      }
    }
    
    // --- 7. Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple notification (custom modal preferred over alert, but keeping alert logic for simplicity)
            alert(`Thank you, ${name}! Your message has been received. We will respond to ${email} shortly.`);
            
            // Redirect to WhatsApp with a pre-filled message (as a powerful alternative CTA)
            const whatsappMessage = encodeURIComponent(`Hello, I'm ${name} (${email}). I have an enquiry: ${message}`);
            window.open(`https://wa.me/2567XXXXXXXX?text=${whatsappMessage}`, '_blank');
            
            this.reset();
        });
    }
});
