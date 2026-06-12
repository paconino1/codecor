/**
 * Codecor Rota el Porteño
 * admin.js - Lógica del panel de administración (Vanilla JS)
 */

const initApp = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
        const errorBanner = document.createElement('div');
        errorBanner.className = 'body-md text-error p-lg bg-surface';
        errorBanner.style.position = 'fixed';
        errorBanner.style.top = '0';
        errorBanner.style.left = '0';
        errorBanner.style.width = '100%';
        errorBanner.style.zIndex = '9999';
        errorBanner.style.textAlign = 'center';
        errorBanner.textContent = "Error crítico: Cliente Supabase no inicializado.";
        document.body.prepend(errorBanner);
        return;
    }

    // --- Referencias al DOM ---
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');

    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const panels = document.querySelectorAll('.panel');

    // Modales y formularios (Inmuebles)
    const modalInmueble = document.getElementById('modal-inmueble');
    const formInmueble = document.getElementById('form-inmueble');
    const btnAddInmueble = document.getElementById('btn-add-inmueble');

    // Modales y formularios (Servicios)
    const modalServicio = document.getElementById('modal-servicio');
    const formServicio = document.getElementById('form-servicio');
    const btnAddServicio = document.getElementById('btn-add-servicio');

    // --- Autenticación ---

    // Comprobar estado de sesión
    let session = null;
    try {
        const response = await supabase.auth.getSession();
        session = response.data ? response.data.session : null;
    } catch (err) {
        console.error("Error obteniendo sesión:", err);
    }
    
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }

    // Escuchar cambios de autenticación
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            showDashboard();
        } else if (event === 'SIGNED_OUT') {
            showLogin();
        }
    });

    // Handle Login Submit
    const btnLoginSubmit = document.getElementById('btn-login-submit');
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Validar campos manualmente al no usar submit
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                loginError.textContent = 'Por favor, rellena ambos campos.';
                loginError.style.display = 'block';
                return;
            }
            
            loginError.style.display = 'none';
            btnLoginSubmit.disabled = true;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                loginError.textContent = error.message === 'Email not confirmed' 
                    ? 'Debes confirmar tu correo electrónico. Revisa tu bandeja de entrada.' 
                    : `Error: ${error.message}`;
                loginError.style.display = 'block';
                btnLoginSubmit.textContent = 'Iniciar Sesión';
                btnLoginSubmit.disabled = false;
            } else {
                // Forzar visualización del dashboard tras login exitoso
                btnLoginSubmit.textContent = 'Iniciar Sesión';
                btnLoginSubmit.disabled = false;
                showDashboard();
            }
        } catch (err) {
            loginError.textContent = 'Error inesperado al intentar iniciar sesión.';
            loginError.style.display = 'block';
            btnLoginSubmit.textContent = 'Iniciar Sesión';
            btnLoginSubmit.disabled = false;
        }
    });
    
    // Permitir enviar con la tecla Enter
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnLoginSubmit.click();
            }
        });
    }

    }


    // Handle Logout
    btnLogout.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    // --- Navegación del Dashboard ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Actualizar clase activa en nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Mostrar el panel correspondiente
            const targetId = item.getAttribute('data-target');
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Cargar datos si es necesario
            loadPanelData(targetId);
        });
    });

    // Funciones de Vista
    function showLogin() {
        dashboardView.style.display = 'none';
        loginView.style.display = 'flex';
        loginForm.reset();
    }

    function showDashboard() {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
        // Cargar datos iniciales (Inmuebles que es el activo por defecto)
        loadPanelData('panel-inmuebles');
    }

    function loadPanelData(panelId) {
        if (panelId === 'panel-inmuebles') loadInmuebles();
        else if (panelId === 'panel-servicios') loadServicios();
        else if (panelId === 'panel-mensajes') loadMensajes();
    }

    // --- Modal de Confirmación ---
    function confirmAction(message, onConfirm) {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal active';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.maxWidth = '400px';
        modalContent.style.textAlign = 'center';
        
        const title = document.createElement('h3');
        title.className = 'headline-md mb-md';
        title.textContent = 'Confirmar Acción';
        
        const msg = document.createElement('p');
        msg.className = 'body-md mb-lg';
        msg.textContent = message;
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'flex justify-center gap-sm';
        
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-secondary dark';
        btnCancel.textContent = 'Cancelar';
        btnCancel.onclick = () => confirmModal.remove();
        
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-primary';
        btnConfirm.textContent = 'Aceptar';
        btnConfirm.onclick = () => {
            onConfirm();
            confirmModal.remove();
        };
        
        btnGroup.appendChild(btnCancel);
        btnGroup.appendChild(btnConfirm);
        
        modalContent.appendChild(title);
        modalContent.appendChild(msg);
        modalContent.appendChild(btnGroup);
        confirmModal.appendChild(modalContent);
        
        document.body.appendChild(confirmModal);
    }

    // --- Modales ---
    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
    };
    
    // --- INMUEBLES ---
    const btnImportarInmuebles = document.getElementById('btn-importar-inmuebles');
    const tbodyInmuebles = document.querySelector('#table-inmuebles tbody');

    if (btnAddInmueble) {
        btnAddInmueble.addEventListener('click', () => {
            formInmueble.reset();
            document.getElementById('inmueble-id').value = '';
            document.getElementById('inmueble-img-url-existing').value = '';
            document.getElementById('inmueble-error').style.display = 'none';
            document.getElementById('modal-inmueble-title').textContent = 'Añadir Inmueble';
            openModal('modal-inmueble');
        });
    }

    if (btnImportarInmuebles) {
        btnImportarInmuebles.addEventListener('click', async () => {
            const properties = [
                { title: "Pisos de Ladrillos", description: "60m² construidos, cómodo y acogedor, excelente ubicación, luminoso.", price: "185.000€", status: "venta", image_url: "assets/img/pisoLadrillo.jpeg" },
                { title: "Finca Rústica", description: "Nave, Invernadero, Casa de 135 m². Espacio, comodidad y naturaleza. Luz, Agua, Agua de riego, Entorno natural.", price: "250.000€", status: "venta", image_url: "assets/img/finca.jpeg" },
                { title: "Terreno 4,772 metros", description: "Amplio y llano, entorno natural, zona tranquila, ideal para tu proyecto.", price: "70.000€", status: "venta", image_url: "assets/img/terreno1.jpeg" },
                { title: "Terreno 980 metros", description: "Terreno con muchas posibilidades.", price: "65.000€", status: "venta", image_url: "assets/img/terreno2.jpeg" },
                { title: "Terreno en venta 3,500 m²", description: "Ideal para proyecto residencial, quinta o inversión. Amplio terreno, pozo con agua disponible.", price: "40.000€", status: "venta", image_url: "assets/img/terreno3.jpeg" },
                { title: "Terreno en venta 5,000 m²", description: "Tu lugar ideal para construir tus sueños. Amplio terreno rústico en un entorno natural y tranquilo.", price: "55.000€", status: "venta", image_url: "assets/img/terreno4.jpeg" },
                { title: "Lote en Venta 8,500 m²", description: "Espacio ideal para construir tus sueños, invertir o disfrutar en familia. Zona tranquila, entorno natural.", price: "90.000€", status: "venta", image_url: "assets/img/terrenoLote.jpeg" },
                { title: "Terreno 3,000 metros frente", description: "Amplio terreno ideal para proyectos residenciales o de inversión. Zona tranquila, entorno natural.", price: "70.000€", status: "venta", image_url: "assets/img/terreno5.jpeg" },
                { title: "Terreno 5,000 metros", description: "Invernadero, Agua de riego. Ideal para cultivos y producción.", price: "80.000€", status: "venta", image_url: "assets/img/terreno6.jpeg" },
                { title: "Terreno 4,472 metros", description: "Estructura de nave legal. Lista para tu proyecto.", price: "100.000€", status: "venta", image_url: "assets/img/terreno7.jpeg" },
                { title: "Terreno 22,495 metros", description: "Amplio y llano, entorno natural, zona tranquila. Agua de riego.", price: "35.000€", status: "venta", image_url: "assets/img/terreno8.jpeg" },
                { title: "2 Campos", description: "60 mil metros cuadrados. Negocio o chalet.", price: "400.000€", status: "venta", image_url: "assets/img/dosCamposLote.jpeg" }
            ];
            const originalText = btnImportarInmuebles.textContent;
            btnImportarInmuebles.textContent = 'Importando...';
            btnImportarInmuebles.disabled = true;
            try {
                for(let p of properties) {
                    await supabase.from('properties').insert([p]);
                }
                alert('Inmuebles importados correctamente');
                loadInmuebles();
            } catch(e) {
                alert('Error importando: ' + e.message);
            } finally {
                btnImportarInmuebles.textContent = originalText;
                btnImportarInmuebles.disabled = false;
            }
        });
    }

    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    async function loadInmuebles() {
        const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
        if (error) { console.error("Error cargando inmuebles:", error); return; }
        
        tbodyInmuebles.textContent = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            
            const shortId = item.id.substring(0, 6).toUpperCase();
            const tdId = document.createElement('td'); tdId.textContent = shortId;
            const tdTitle = document.createElement('td'); tdTitle.textContent = item.title;
            const tdPrice = document.createElement('td'); tdPrice.textContent = `${item.price} €`;
            const tdStatus = document.createElement('td'); tdStatus.textContent = item.status === 'venta' ? 'En Venta' : 'En Alquiler';
            
            const tdActions = document.createElement('td');
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-primary btn-sm';
            btnEdit.style.marginRight = '0.5rem';
            btnEdit.textContent = 'Editar';
            btnEdit.onclick = () => editInmueble(item);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-secondary dark btn-sm';
            btnDelete.textContent = 'Borrar';
            btnDelete.onclick = () => deleteInmueble(item.id);

            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);

            tr.appendChild(tdId);
            tr.appendChild(tdTitle);
            tr.appendChild(tdPrice);
            tr.appendChild(tdStatus);
            tr.appendChild(tdActions);
            
            tbodyInmuebles.appendChild(tr);
        });
    }

    formInmueble.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const errorDiv = document.getElementById('inmueble-error');
        errorDiv.style.display = 'none';
        
        const id = document.getElementById('inmueble-id').value;
        const fileInput = document.getElementById('inmueble-img-file');
        const existingUrl = document.getElementById('inmueble-img-url-existing').value;
        
        let finalImageUrl = existingUrl;
        
        // Disable button during upload
        const submitBtn = formInmueble.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subiendo...';
        
        try {
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `inmuebles/${fileName}`;
                
                const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
                
                if (uploadError) {
                    throw new Error("Error al subir imagen: " + uploadError.message + ". Revisa las Políticas de Seguridad (RLS) en Supabase.");
                }
                
                const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                finalImageUrl = data.publicUrl;
            } else if (!existingUrl) {
                throw new Error("Debes seleccionar una imagen para el inmueble.");
            }
            
            const payload = {
                title: document.getElementById('inmueble-title').value,
                description: document.getElementById('inmueble-desc').value,
                price: document.getElementById('inmueble-price').value,
                status: document.getElementById('inmueble-status').value,
                image_url: finalImageUrl
            };

            if (id) {
                // Update
                const { error } = await supabase.from('properties').update(payload).eq('id', id);
                if (error) throw new Error("Error al actualizar el inmueble en la base de datos.");
            } else {
                // Insert
                const { error } = await supabase.from('properties').insert([payload]);
                if (error) throw new Error("Error al insertar el inmueble en la base de datos.");
            }
            
            closeModal('modal-inmueble');
            loadInmuebles();
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    function editInmueble(item) {
        formInmueble.reset();
        document.getElementById('inmueble-id').value = item.id;
        document.getElementById('inmueble-title').value = item.title;
        document.getElementById('inmueble-desc').value = item.description;
        document.getElementById('inmueble-price').value = item.price;
        document.getElementById('inmueble-status').value = item.status;
        document.getElementById('inmueble-img-url-existing').value = item.image_url;
        document.getElementById('inmueble-error').style.display = 'none';
        document.getElementById('modal-inmueble-title').textContent = 'Editar Inmueble';
        openModal('modal-inmueble');
    }

    async function deleteInmueble(id) {
        confirmAction("¿Está seguro de que desea borrar este inmueble?", async () => {
            const { error } = await supabase.from('properties').delete().eq('id', id);
            if (error) {
                console.error("Error al borrar:", error);
            } else {
                loadInmuebles();
            }
        });
    }

    // --- CRUD Servicios ---
    const tbodyServicios = document.querySelector('#table-servicios tbody');

    if (btnAddServicio) {
        btnAddServicio.addEventListener('click', () => {
            formServicio.reset();
            document.getElementById('servicio-id').value = '';
            document.getElementById('modal-servicio-title').textContent = 'Añadir Servicio';
            openModal('modal-servicio');
        });
    }

    async function loadServicios() {
        const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
        if (error) { console.error("Error cargando servicios:", error); return; }
        
        tbodyServicios.textContent = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            
            const tdName = document.createElement('td'); tdName.textContent = item.name;
            const tdIcon = document.createElement('td');
            const spanIcon = document.createElement('span');
            spanIcon.className = 'material-symbols-outlined';
            spanIcon.textContent = item.icon;
            tdIcon.appendChild(spanIcon);
            
            const tdActions = document.createElement('td');
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-primary btn-sm';
            btnEdit.style.marginRight = '0.5rem';
            btnEdit.textContent = 'Editar';
            btnEdit.onclick = () => editServicio(item);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-secondary dark btn-sm';
            btnDelete.textContent = 'Borrar';
            btnDelete.onclick = () => deleteServicio(item.id);

            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);

            tr.appendChild(tdName);
            tr.appendChild(tdIcon);
            tr.appendChild(tdActions);
            tbodyServicios.appendChild(tr);
        });
    }

    const btnResetServicios = document.getElementById('btn-reset-servicios');
    if (btnResetServicios) {
        btnResetServicios.addEventListener('click', () => {
            confirmAction("¿Estás seguro de que quieres borrar todos los servicios actuales y restablecer los servicios por defecto de Codecor?", async () => {
                const originalText = btnResetServicios.textContent;
                btnResetServicios.textContent = 'Restableciendo...';
                btnResetServicios.disabled = true;
                
                try {
                    // Primero borramos todos
                    const { data: currentServices } = await supabase.from('services').select('id');
                    if (currentServices && currentServices.length > 0) {
                        for (let s of currentServices) {
                            await supabase.from('services').delete().eq('id', s.id);
                        }
                    }
                    
                    // Insertamos los correctos
                    const defaultServices = [
                        { name: "Inmobiliaria", icon: "real_estate_agent" },
                        { name: "Construcción", icon: "construction" },
                        { name: "Inversiones", icon: "trending_up" },
                        { name: "Seguros", icon: "shield" },
                        { name: "Mantenimiento General", icon: "handyman" }
                    ];
                    
                    const { error } = await supabase.from('services').insert(defaultServices);
                    if (error) throw error;
                    
                    loadServicios();
                    alert("Servicios restablecidos correctamente. Puedes cerrar esta alerta.");
                } catch (error) {
                    console.error("Error restableciendo servicios", error);
                    alert("Hubo un error al restablecer los servicios.");
                } finally {
                    btnResetServicios.textContent = originalText;
                    btnResetServicios.disabled = false;
                }
            });
        });
    }

    if (formServicio) {
        formServicio.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('servicio-id').value;
            const payload = {
                name: document.getElementById('servicio-name').value,
                icon: document.getElementById('servicio-icon').value
            };

            if (id) {
                // Update
                const { error } = await supabase.from('services').update(payload).eq('id', id);
                if (error) console.error("Error al actualizar:", error);
            } else {
                // Insert
                const { error } = await supabase.from('services').insert([payload]);
                if (error) console.error("Error al insertar:", error);
            }
            
            closeModal('modal-servicio');
            loadServicios();
        });
    }

    function editServicio(item) {
        document.getElementById('servicio-id').value = item.id;
        document.getElementById('servicio-name').value = item.name;
        document.getElementById('servicio-icon').value = item.icon;
        document.getElementById('modal-servicio-title').textContent = 'Editar Servicio';
        openModal('modal-servicio');
    }

    async function deleteServicio(id) {
        confirmAction("¿Está seguro de que desea borrar este servicio?", async () => {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) {
                console.error("Error al borrar:", error);
            } else {
                loadServicios();
            }
        });
    }

    // --- CRUD Mensajes ---
    const tbodyMensajes = document.querySelector('#table-mensajes tbody');
    async function loadMensajes() {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (error) { console.error("Error cargando mensajes:", error); return; }
        
        tbodyMensajes.textContent = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            
            const shortId = item.id ? item.id.substring(0, 6).toUpperCase() : '-';
            const d = new Date(item.created_at);
            const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            
            const tdId = document.createElement('td'); tdId.textContent = shortId;
            const tdDate = document.createElement('td'); tdDate.textContent = dateStr;
            const tdName = document.createElement('td'); tdName.textContent = item.name;
            
            let formattedPhone = item.phone || '-';
            if (formattedPhone !== '-') {
                const str = String(formattedPhone);
                if (str.length === 11 && str.startsWith('34')) {
                    formattedPhone = `+34 ${str.substring(2,5)} ${str.substring(5,7)} ${str.substring(7,9)} ${str.substring(9,11)}`;
                } else if (!str.startsWith('+')) {
                    formattedPhone = '+' + str;
                }
            }
            const tdPhone = document.createElement('td'); tdPhone.textContent = formattedPhone;
            const tdEmail = document.createElement('td'); tdEmail.textContent = item.email || '-';
            const tdService = document.createElement('td'); tdService.textContent = item.service_type;
            const tdMsg = document.createElement('td'); tdMsg.textContent = item.message;

            const tdActions = document.createElement('td');
            const btnResponder = document.createElement('a');
            btnResponder.className = 'btn btn-primary btn-sm';
            btnResponder.textContent = 'Responder';
            
            btnResponder.target = '_blank';
            
            if (item.phone && String(item.phone).trim() !== '') {
                // Convertir a string y limpiar
                const cleanPhone = String(item.phone).replace(/[^0-9+]/g, '');
                btnResponder.href = `https://wa.me/${cleanPhone}`;
            } else if (item.email && String(item.email).trim() !== '') {
                btnResponder.href = `mailto:${item.email}`;
            } else {
                btnResponder.href = '#';
                btnResponder.target = '';
                btnResponder.onclick = (e) => { e.preventDefault(); };
            }
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-secondary dark btn-sm';
            btnDelete.textContent = 'Borrar';
            btnDelete.onclick = () => deleteMensaje(item.id);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex gap-md flex-wrap';
            actionsDiv.appendChild(btnResponder);
            actionsDiv.appendChild(btnDelete);
            tdActions.appendChild(actionsDiv);

            tr.appendChild(tdId);
            tr.appendChild(tdDate);
            tr.appendChild(tdName);
            tr.appendChild(tdPhone);
            tr.appendChild(tdEmail);
            tr.appendChild(tdService);
            tr.appendChild(tdMsg);
            tr.appendChild(tdActions);
            tbodyMensajes.appendChild(tr);
        });
    }

    async function deleteMensaje(id) {
        confirmAction("¿Está seguro de que desea borrar este mensaje?", async () => {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) {
                console.error("Error al borrar mensaje:", error);
            } else {
                loadMensajes();
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
