/**
 * Codecor Rota el Porteño
 * main.js - Lógica de la parte pública (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navDesktop = document.querySelector('.nav-desktop');
    if (mobileMenuBtn && navDesktop) {
        mobileMenuBtn.addEventListener('click', () => {
            navDesktop.classList.toggle('menu-open');
        });

        const navLinksMobile = navDesktop.querySelectorAll('a');
        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                navDesktop.classList.remove('menu-open');
            });
        });
    }

    // --- Active Link highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            // No quitamos active de enlaces desplegables si estamos en subpáginas
            const isHomePage = document.getElementById('inicio') !== null;
            if (isHomePage) {
                link.classList.remove('active');
            } else if (!link.classList.contains('dropdown-toggle')) {
                link.classList.remove('active');
            }
            if (current && link.getAttribute('href') && link.getAttribute('href').includes('#' + current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Service Selection Logic ---
    const serviceLinks = document.querySelectorAll('.service-select');
    const serviceSelectDropdown = document.getElementById('service-type');
    const mantenimientoSubtypeGroup = document.getElementById('mantenimiento-subtype-group');
    const mantenimientoSubtypeDropdown = document.getElementById('mantenimiento-subtype');
    const segurosSubtypeGroup = document.getElementById('seguros-subtype-group');
    const segurosSubtypeDropdown = document.getElementById('seguros-subtype');
    
    // Función para manejar visibilidad del sub-desplegable
    function handleServiceTypeChange() {
        if (serviceSelectDropdown.value === 'mantenimiento') {
            mantenimientoSubtypeGroup.style.display = 'block';
            mantenimientoSubtypeDropdown.required = true;
            if (segurosSubtypeGroup) {
                segurosSubtypeGroup.style.display = 'none';
                segurosSubtypeDropdown.required = false;
                segurosSubtypeDropdown.value = '';
            }
        } else if (serviceSelectDropdown.value === 'seguros') {
            if (segurosSubtypeGroup) {
                segurosSubtypeGroup.style.display = 'block';
                segurosSubtypeDropdown.required = true;
            }
            mantenimientoSubtypeGroup.style.display = 'none';
            mantenimientoSubtypeDropdown.required = false;
            mantenimientoSubtypeDropdown.value = '';
        } else {
            mantenimientoSubtypeGroup.style.display = 'none';
            mantenimientoSubtypeDropdown.required = false;
            mantenimientoSubtypeDropdown.value = '';
            if (segurosSubtypeGroup) {
                segurosSubtypeGroup.style.display = 'none';
                segurosSubtypeDropdown.required = false;
                segurosSubtypeDropdown.value = '';
            }
        }
    }

    if (serviceSelectDropdown) {
        serviceSelectDropdown.addEventListener('change', handleServiceTypeChange);
    }
    
    if (serviceLinks.length > 0 && serviceSelectDropdown) {
        serviceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const serviceType = link.getAttribute('data-service');
                if (serviceType) {
                    serviceSelectDropdown.value = serviceType;
                    handleServiceTypeChange();
                }
            });
        });
    }

    // --- Autoselect Service from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('servicio');
    const subtypeParam = urlParams.get('subtipo');
    if (serviceParam && serviceSelectDropdown) {
        serviceSelectDropdown.value = serviceParam;
        handleServiceTypeChange();
        
        if (subtypeParam) {
            if (serviceParam === 'seguros' && segurosSubtypeDropdown) {
                segurosSubtypeDropdown.value = subtypeParam;
            } else if (serviceParam === 'mantenimiento' && mantenimientoSubtypeDropdown) {
                mantenimientoSubtypeDropdown.value = subtypeParam;
            }
        }
    }
    
    // --- Autoselect Inmueble de URL ---
    const inmuebleParam = urlParams.get('inmueble');
    if (inmuebleParam && serviceSelectDropdown) {
        serviceSelectDropdown.value = 'inmobiliaria';
        handleServiceTypeChange();
        const messageBox = document.getElementById('message');
        if (messageBox) {
            messageBox.value = `Hola, estoy interesado en recibir más información sobre la propiedad: ${inmuebleParam}`;
        }
    }
    
    // --- Inicialización de Supabase ---
    const supabase = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;

    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && supabase) {
        loadPublicServices();
    }
    
    async function loadPublicServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error("Error cargando servicios:", error);
            servicesGrid.textContent = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'col-span-12 text-center py-xl';
            const errorP = document.createElement('p');
            errorP.className = 'body-md text-error';
            errorP.textContent = 'Error al cargar los servicios.';
            errorDiv.appendChild(errorP);
            servicesGrid.appendChild(errorDiv);
            return;
        }

        servicesGrid.textContent = '';

        if (data.length === 0) {
            // Mostrar mensaje si está vacío
            const noData = document.createElement('div');
            noData.className = 'col-span-12 text-center py-xl body-md text-on-surface-variant';
            noData.textContent = 'No hay servicios disponibles en este momento.';
            servicesGrid.appendChild(noData);
            return;
        }

        // Filtramos para asegurar que solo se muestren los 5 principales, en caso de que en BD haya más
        const mainServicesNames = ['inmobiliaria', 'construcción', 'inversiones', 'seguros', 'mantenimiento general'];
        const mainServices = data.filter(s => mainServicesNames.includes(s.name.toLowerCase().trim()));

        mainServices.forEach((service, index) => {
            const card = document.createElement('div');
            // Hacer la primera tarjeta más grande (8 columnas) como estaba en el diseño estático si es Inmobiliaria
            if (index === 0 && service.name.toLowerCase().includes('inmobiliaria')) {
                card.className = 'col-span-8 card fade-in-up delay-100';
            } else {
                const delay = (index % 3 + 1) * 100; // 100, 200, 300
                card.className = `col-span-4 card fade-in-up delay-${delay}`;
            }

            const contentDiv = document.createElement('div');
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined card-icon';
            iconSpan.textContent = service.icon || 'star';
            
            const title = document.createElement('h3');
            title.className = 'headline-md mb-sm';
            title.textContent = service.name;
            
            const desc = document.createElement('p');
            desc.className = 'body-md text-on-surface-variant';
            // Como la BD solo tiene nombre e icono por ahora, usaremos una descripción genérica o el nombre.
            // Si quieres guardar descripción en BD tendrías que añadir la columna, por ahora hardcodeamos según nombre.
            let descText = 'Servicio corporativo de alta calidad.';
            let linkHref = '#contacto';
            let isSelectLink = true;
            let linkText = 'Consultar';
            let dataService = service.name.toLowerCase().replace(/ & .*/, '').trim();
            
            if (service.name.toLowerCase().includes('inmobiliaria')) {
                descText = 'Gestión premium de propiedades corporativas y residenciales de alto standing. Tasaciones precisas y asesoramiento estratégico.';
                linkHref = 'inmobiliaria.html';
                isSelectLink = false;
                linkText = 'Ver Propiedades';
            } else if (service.name.toLowerCase().includes('inversion')) {
                descText = 'Carteras de inversión diseñadas con rigor analítico para asegurar rentabilidad a largo plazo.';
                dataService = 'inversiones';
            } else if (service.name.toLowerCase().includes('construcci')) {
                descText = 'Ejecución de obras con estándares arquitectónicos superiores y control de calidad exhaustivo.';
                dataService = 'construccion';
            } else if (service.name.toLowerCase().includes('mantenimiento')) {
                descText = 'Reformas, fontanería, electricidad, limpieza, jardinería, suministros, mudanzas y pintura para preservar sus instalaciones.';
                dataService = 'mantenimiento';
            } else if (service.name.toLowerCase().includes('seguro')) {
                descText = 'Coberturas corporativas a medida, brindando la protección necesaria ante cualquier eventualidad.';
                linkHref = 'seguros.html';
                isSelectLink = false;
                linkText = 'Ver Catálogo';
            }

            desc.textContent = descText;

            contentDiv.appendChild(iconSpan);
            contentDiv.appendChild(title);
            contentDiv.appendChild(desc);

            const link = document.createElement('a');
            link.href = linkHref;
            link.className = 'card-link label-md' + (isSelectLink ? ' service-select' : '');
            if (isSelectLink) link.setAttribute('data-service', dataService);
            link.textContent = linkText + ' ';
            const linkIcon = document.createElement('span');
            linkIcon.className = 'material-symbols-outlined';
            linkIcon.textContent = 'arrow_forward';
            link.appendChild(linkIcon);
            
            // Si es un enlace de contacto, añadir el evento para seleccionar el dropdown
            if (isSelectLink) {
                link.addEventListener('click', () => {
                    if (serviceSelectDropdown) {
                        serviceSelectDropdown.value = dataService;
                        handleServiceTypeChange();
                    }
                });
            }

            card.appendChild(contentDiv);
            card.appendChild(link);
            
            servicesGrid.appendChild(card);
        });
        
        // Re-init observer for new elements
        initObserver();
    }

    // --- Cargar Inmuebles Dinámicamente ---
    const propertiesGrid = document.getElementById('properties-grid');
    if (propertiesGrid && supabase) {
        loadPublicProperties();
    }

    async function loadPublicProperties() {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error cargando inmuebles:", error);
            propertiesGrid.textContent = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'col-span-12 text-center py-xl';
            const errorP = document.createElement('p');
            errorP.className = 'body-md text-error';
            errorP.textContent = 'Error al cargar las propiedades.';
            errorDiv.appendChild(errorP);
            propertiesGrid.appendChild(errorDiv);
            return;
        }

        propertiesGrid.textContent = ''; // Limpiar loader

        let propertiesData = data;

        if (propertiesData.length === 0) {
            // Mostrar propiedades de demostración si la BD está vacía
            propertiesData = [
                {
                    title: "Edificio Corporativo Norte",
                    description: "Moderno edificio de oficinas con certificación LEED, ubicado en el distrito financiero.",
                    price: "4.500.000",
                    status: "venta",
                    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0v444y3YV-5rL3H_6G6N4m4Vv0p2uF2n1Jk3M041J8Q2B_wOQjT1P-4gI9Q_rU7o5L2ZpYq2y-0C5a9K4S0eL2N7V9V8_mR4P9J8N1R7v2L5T4W2W0F1P-7qG6mC9zK_5P2B9_W9G_0B-wG8xK4nO4V9qQ9bX-9aJ0V7_Y_1J5xY6gR9D1E4-R2sC2M1H-0I3S5F-3c"
                },
                {
                    title: "Oficina Ejecutiva Premium",
                    description: "Planta completa de oficinas con vistas panorámicas, ideal para sedes regionales.",
                    price: "12.000",
                    status: "alquiler",
                    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7c5Q3P_xVw1Z8B1X_1W9n8gL8Y5V0_xW7C9L2T8R1qL1R7W_1W1n0_5P2B9_W9G_0B-wG8xK4nO4V9qQ9bX-9aJ0V7_Y_1J5xY6gR9D1E4-R2sC2M1H-0I3S5F-3c"
                }
            ];
            // Fix invalid URLs for dummy data with a working placeholder
            data[0].image_url = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop";
            data[1].image_url = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop";
        }

        propertiesData.forEach((prop, index) => {
            const card = document.createElement('div');
            card.className = 'col-span-4 card p-0 overflow-hidden property-card';
            card.style.padding = '0'; // override default card padding

            // Manejo de múltiples imágenes (separadas por comas)
            const imageUrls = prop.image_url ? prop.image_url.split(',').map(u => u.trim()) : ['assets/img/hero.jpg'];
            const mainImageUrl = imageUrls[0];

            const imgContainer = document.createElement('div');
            imgContainer.style.height = '250px'; // Aumentado para mejor encuadre
            imgContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.src = mainImageUrl;
            img.alt = prop.title;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center'; // Asegura centrado

            const statusBadge = prop.status.toLowerCase() === 'venta' ? 'En Venta' : 'En Alquiler';
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.position = 'absolute';
            badge.style.top = 'var(--spacing-sm)';
            badge.style.left = 'var(--spacing-sm)';
            badge.textContent = statusBadge;

            imgContainer.appendChild(img);
            imgContainer.appendChild(badge);

            const contentContainer = document.createElement('div');
            contentContainer.style.padding = 'var(--spacing-lg)';
            contentContainer.style.flexGrow = '1';
            contentContainer.style.display = 'flex';
            contentContainer.style.flexDirection = 'column';

            const title = document.createElement('h3');
            title.className = 'headline-md mb-xs';
            title.textContent = prop.title;

            const desc = document.createElement('p');
            desc.className = 'body-md text-on-surface-variant mb-md';
            desc.style.flexGrow = '1';
            desc.textContent = prop.description;

            const price = document.createElement('h4');
            price.className = 'headline-lg text-primary';
            const priceStr = String(prop.price).trim();
            price.textContent = priceStr.endsWith('€') ? priceStr : `${priceStr} €`;

            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = 'var(--spacing-sm)';
            btnContainer.style.marginTop = 'var(--spacing-md)';
            btnContainer.style.flexWrap = 'wrap';

            const btnConsultar = document.createElement('a');
            btnConsultar.href = `index.html?inmueble=${encodeURIComponent(prop.title)}#contacto`;
            btnConsultar.className = 'btn btn-primary btn-sm';
            btnConsultar.textContent = 'Consultar';
            btnConsultar.style.textAlign = 'center';
            btnConsultar.style.flex = '1';
            
            btnContainer.appendChild(btnConsultar);

            if (imageUrls.length > 0) {
                const btnFotos = document.createElement('button');
                btnFotos.className = 'btn btn-secondary btn-sm dark';
                btnFotos.textContent = 'Ver fotos';
                btnFotos.style.textAlign = 'center';
                btnFotos.style.flex = '1';
                btnFotos.onclick = () => openGalleryModal(prop.title, imageUrls);
                btnContainer.appendChild(btnFotos);
            }

            contentContainer.appendChild(title);
            contentContainer.appendChild(desc);
            contentContainer.appendChild(price);
            contentContainer.appendChild(btnContainer);

            card.appendChild(imgContainer);
            card.appendChild(contentContainer);
            
            card.classList.add('fade-in-up');
            card.classList.add('delay-' + ((index % 3 + 1) * 100)); // 100, 200, 300
            
            propertiesGrid.appendChild(card);
        });
        
        // Re-init observer for new elements
        initObserver();
    }

    // --- Contact Form Submission a Supabase ---
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            if (!supabase) {
                console.error("Supabase no configurado, no se puede enviar mensaje.");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            let fullServiceType = document.getElementById('service-type').value;
            if (fullServiceType === 'mantenimiento') {
                const subtype = document.getElementById('mantenimiento-subtype').value;
                if (subtype) {
                    fullServiceType += ` (${subtype})`;
                }
            } else if (fullServiceType === 'seguros') {
                const subtype = document.getElementById('seguros-subtype').value;
                if (subtype) {
                    fullServiceType += ` (${subtype})`;
                }
            }

            const rawPhone = document.getElementById('phone').value;
            let cleanPhone = rawPhone.replace(/[^0-9]/g, '');

            // Si el cliente introduce su número español sin prefijo (9 dígitos que empiezan por 6, 7, 8 o 9),
            // se lo añadimos automáticamente para que WhatsApp funcione siempre.
            if (cleanPhone.length === 9 && /^[6789]/.test(cleanPhone)) {
                cleanPhone = '34' + cleanPhone;
            }

            const payload = {
                name: document.getElementById('name').value,
                phone: cleanPhone,
                email: document.getElementById('email').value,
                service_type: fullServiceType,
                message: document.getElementById('message').value
            };

            const { error } = await supabase.from('messages').insert([payload]);

            if (error) {
                console.error('Error enviando mensaje:', error);
                submitBtn.textContent = 'Enviar Consulta';
                submitBtn.disabled = false;
                
                // Mostrar error visual
                formFeedback.style.display = 'block';
                formFeedback.textContent = '';
                const errTitle = document.createElement('h3');
                errTitle.className = 'headline-md text-error mb-md';
                errTitle.textContent = 'Error al enviar';
                const errDesc = document.createElement('p');
                errDesc.className = 'body-md text-white';
                errDesc.textContent = 'Hubo un problema procesando su solicitud. Por favor, intente más tarde.';
                formFeedback.appendChild(errTitle);
                formFeedback.appendChild(errDesc);
            } else {
                // Mostrar éxito visual
                contactForm.style.display = 'none';
                formFeedback.style.display = 'block';
                
                formFeedback.textContent = ''; 
                const successTitle = document.createElement('h3');
                successTitle.className = 'headline-md text-white mb-md';
                successTitle.textContent = '¡Gracias por su consulta!';
                
                const successDesc = document.createElement('p');
                successDesc.className = 'body-md text-white';
                successDesc.textContent = 'Hemos recibido su mensaje y uno de nuestros asesores se pondrá en contacto con usted a la brevedad.';
                
                formFeedback.appendChild(successTitle);
                formFeedback.appendChild(successDesc);
            }
        });
    }

    // --- Intersection Observer para Animaciones ---
    function initObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observerObj) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerObj.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.fade-in-up:not(.is-visible)');
        animateElements.forEach(el => observer.observe(el));
    }
    
    // Init initial elements
    initObserver();

    // Galería Modal y Slider
    let currentGalleryUrls = [];
    let currentSlideIndex = 0;

    window.openGalleryModal = function(title, imageUrls) {
        let modal = document.getElementById('modal-galeria');
        if (!modal) return;
        
        document.getElementById('modal-galeria-title').textContent = title;
        currentGalleryUrls = imageUrls.map(url => url.trim());
        currentSlideIndex = 0;
        
        renderThumbnails();
        loadGallerySlide(currentSlideIndex);
        
        modal.classList.add('active');
    };

    function renderThumbnails() {
        const thumbContainer = document.getElementById('gallery-thumbnails');
        if (!thumbContainer) return;
        thumbContainer.innerHTML = '';
        
        currentGalleryUrls.forEach((url, index) => {
            let thumbEl;
            if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) {
                // Para videos, mostramos un indicador cuadrado oscuro con el icono de play
                thumbEl = document.createElement('div');
                thumbEl.className = 'video-thumb-indicator';
                const icon = document.createElement('span');
                icon.className = 'material-symbols-outlined';
                icon.textContent = 'play_circle';
                thumbEl.appendChild(icon);
            } else {
                thumbEl = document.createElement('img');
                thumbEl.src = url;
                thumbEl.className = 'gallery-thumb';
            }
            
            thumbEl.onclick = () => loadGallerySlide(index);
            thumbContainer.appendChild(thumbEl);
        });
    }

    function loadGallerySlide(index) {
        if (index < 0 || index >= currentGalleryUrls.length) return;
        currentSlideIndex = index;
        
        const mainView = document.getElementById('gallery-main-view');
        if (!mainView) return;
        
        // Remove current media (keeping buttons)
        const currentMedia = mainView.querySelector('.media-element');
        if (currentMedia) currentMedia.remove();
        
        const url = currentGalleryUrls[index];
        let mediaEl;
        
        if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) {
            mediaEl = document.createElement('video');
            mediaEl.src = url;
            mediaEl.controls = true;
            mediaEl.autoplay = true;
        } else {
            mediaEl = document.createElement('img');
            mediaEl.src = url;
        }
        
        mediaEl.className = 'media-element fade-in-up';
        mediaEl.style.animationDelay = '0s'; // fast appear
        // Insert before the buttons
        const prevBtn = mainView.querySelector('.prev');
        mainView.insertBefore(mediaEl, prevBtn);
        
        // Update thumbnails active state
        const thumbContainer = document.getElementById('gallery-thumbnails');
        if (thumbContainer) {
            Array.from(thumbContainer.children).forEach((thumb, i) => {
                if (i === index) thumb.classList.add('active');
                else thumb.classList.remove('active');
            });
            // Auto scroll to active thumbnail
            const activeThumb = thumbContainer.children[index];
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }

    window.nextGallerySlide = function() {
        let newIndex = currentSlideIndex + 1;
        if (newIndex >= currentGalleryUrls.length) newIndex = 0; // Loop
        loadGallerySlide(newIndex);
    };

    window.prevGallerySlide = function() {
        let newIndex = currentSlideIndex - 1;
        if (newIndex < 0) newIndex = currentGalleryUrls.length - 1; // Loop
        loadGallerySlide(newIndex);
    };

    window.closeGalleryModal = function() {
        const modal = document.getElementById('modal-galeria');
        if (modal) modal.classList.remove('active');
        
        // Stop video if playing
        const mainView = document.getElementById('gallery-main-view');
        if (mainView) {
            const video = mainView.querySelector('video');
            if (video) video.pause();
        }
    };

});
