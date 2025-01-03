// Cargar el navbar y el footer o el sidebar según el dispositivo
window.onload = function() {
    if (isMobile()) {
        // Si es móvil, carga el sidebar y oculta el navbar y footer
        loadSidebar();
    } else {
        // Si es pantalla grande, carga el navbar y el footer normales
        loadComponent("navbar", "components/navbar.html");
        loadComponent("footer", "components/footer.html");
    }

    setupAccordion();
    setNavbarButtonsVisibility();
    setFechaActual();
    selectTipoSolicitud();
};

// Detectar si es una pantalla pequeña (por ejemplo, móviles)
function isMobile() {
    return window.innerWidth <= 768;
}

function loadSidebar() {
    const usuario = JSON.parse(localStorage.getItem('usuario')); // Obtén el objeto usuario desde localStorage
    const logoUrl = "assets/logo.jpeg"; // Ruta del logo (asegúrate de que sea la correcta)

    let sidebarHtml = `
        <div class="menu-icon-container">
            <div class="menu-icon" onclick="openSidebar()">☰</div>
            <img src="${logoUrl}" alt="Logo" class="menu-logo" onclick="window.location.href='index.html'">
        </div>
        <div id="sidebar" class="sidebar">
            <a href="javascript:void(0)" class="closebtn" onclick="closeSidebar()">&times;</a>
            <a href="index.html">Inicio</a>
            <a href="servicios.html">Servicios</a>
            <a href="nosotros.html">Nosotros</a>
            <a href="contacto.html">Contacto</a>
    `;

    // Opciones de navegación específicas según el estado del usuario
    if (usuario) {
        sidebarHtml += `
            <a href="perfil.html">Mi Perfil</a>
            <a href="ver_solicitudes.html">Mis Solicitudes</a>
        `;

        // Opciones adicionales para el administrador
        if (usuario.user_tipo === 'admin') {
            sidebarHtml += `
                
                <a href="asignar_tecnico.html">Administrar solicitudes</a>
                <a href="crea_user.html">Crear técnico o gestor</a>
                <a href="add_service.html">Añadir nuevo servicio</a>
                <a href="add_product.html">Añadir nuevo producto</a>
            `;
        }

        // Opciones adicionales para el técnico
        if (usuario.user_tipo === 'tecnico') {
            sidebarHtml += `
                <a href="mis_asignaciones.html">Mis Asignaciones</a>
                
            `;
        }

        sidebarHtml += `
            <a href="javascript:void(0)" onclick="logoutUsuario()">Cerrar Sesión</a>
        `;
    } else {
        // Opciones para usuarios no logueados
        sidebarHtml += `
            <a href="login.html">Iniciar Sesión</a>
            <a href="registro.html">Registrarse</a>
        `;
    }
    
    sidebarHtml += `</div>`;
    document.body.insertAdjacentHTML("beforeend", sidebarHtml);

    // Añade el evento de clic para cerrar el sidebar al hacer clic fuera de él
    document.addEventListener("click", handleClickOutsideSidebar);
}


function openSidebar() {
    document.getElementById("sidebar").style.width = "250px";
}

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
}

// Función para manejar el clic fuera del sidebar
function handleClickOutsideSidebar(event) {
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.querySelector(".menu-icon");

    // Si el clic ocurrió fuera del sidebar y no en el menú icono, cierra el sidebar
    if (sidebar.style.width === "250px" && !sidebar.contains(event.target) && event.target !== menuIcon) {
        closeSidebar();
    }
}


// Función para mostrar u ocultar los botones de sesión según el estado del usuario
function setNavbarButtonsVisibility() {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const verSolicitudesBtn = document.getElementById('verSolicitudesBtn');
    const miPerfilBtn = document.getElementById('miPerfilBtn');
    const logoutButton = document.getElementById('logoutButton'); // Botón de Cerrar Sesión

    if (loginButton && registerButton && verSolicitudesBtn && miPerfilBtn && logoutButton) {
        const usuario = localStorage.getItem('usuario');
        
        if (usuario) {
            // Usuario logueado: muestra Perfil, Ver Solicitudes y Cerrar Sesión
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            verSolicitudesBtn.style.display = 'inline-block';
            miPerfilBtn.style.display = 'inline-block';
            logoutButton.style.display = 'inline-block';

            // Asigna el evento de cierre de sesión al botón "Cerrar Sesión"
            logoutButton.addEventListener('click', logoutUsuario);
        } else {
            // Usuario no logueado: muestra Iniciar Sesión y Registrarse, oculta Perfil y Ver Solicitudes
            loginButton.style.display = 'inline-block';
            registerButton.style.display = 'inline-block';
            verSolicitudesBtn.style.display = 'none';
            miPerfilBtn.style.display = 'none';
            logoutButton.style.display = 'none'; // Oculta el botón de Cerrar Sesión
        }
    } else {
        console.error("No se encontraron todos los botones de sesión en el navbar.");
    }
}

// Función para cerrar sesión y volver a mostrar los botones
function logoutUsuario() {
    // Eliminar datos de usuario en localStorage y redirigir a la página principal
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioToken'); // Eliminar el token del localStorage
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html'; // Redirige a la página principal después de cerrar sesión

    // Vuelve a mostrar los botones de inicio de sesión y registro
    setNavbarButtonsVisibility();
}

// Función mejorada para cargar componentes externos como navbar y footer
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el componente: ' + filePath);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                
                // Asegurarse de que los botones de sesión estén visibles o no según el estado del usuario
                setNavbarButtonsVisibility();
            } else {
                console.error('Elemento con ID ' + elementId + ' no encontrado');
            }
        })
        .catch(error => console.error(error));
}

// Función para establecer la fecha actual en el campo de fecha "fecha-solicitud"
function setFechaActual() {
    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaSolicitudElement = document.getElementById('fecha-solicitud');
    if (fechaSolicitudElement) {
        fechaSolicitudElement.value = fechaHoy;
    }
}

// Función para seleccionar el tipo de solicitud desde la URL (si está presente)
function selectTipoSolicitud() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoSolicitud = urlParams.get('tipo');
    if (tipoSolicitud) {
        const selectElement = document.getElementById('tipo-solicitud');
        if (selectElement) {
            const optionToSelect = Array.from(selectElement.options).find(
                option => option.value.toLowerCase() === tipoSolicitud.toLowerCase()
            );
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
        }
    }
}

// Configurar el comportamiento del acordeón
function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion-button');
    accordions.forEach(button => {
        button.addEventListener('mouseover', () => {
            const content = button.nextElementSibling;
            button.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
        });
        button.addEventListener('mouseout', () => {
            const content = button.nextElementSibling;
            button.classList.remove('active');
            content.style.maxHeight = "0";
        });
    });
}

// Añadir smooth scroll para los enlaces con anclas
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
