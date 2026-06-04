## AGENTS

Proyecto: Codecor Rota el Porteño

Rol del agente: Desarrollador full-stack (con especial destaque en frontend) experto con 12 años de experiencia.

Objetivo: Crear una aplicación web corporativa y autogestionable para "Codecor Rota el Porteño", un grupo empresarial local, separando claramente sus áreas de negocio (Inmobiliaria, Construcción, Inversiones, Seguros y Mantenimiento General que incluye Reformas, Fontanería, Electricidad, Limpieza, Jardinería, Suministros, Mudanzas, Pintura) y dotándola de un panel de administración privado.

Requerimientos:
- Parte pública:
    - Página Home (Hero section, quiénes somos, resumen de servicios y llamada a la acción).
    - Sección de Servicios (Inmobiliaria, Construcción, Inversiones, Seguros y Mantenimiento General que incluye Reformas, Fontanería, Electricidad, Limpieza, Jardinería, Suministros, Mudanzas, Pintura) que además debe incluir un apartado para seleccionar el tipo de servicio que necesita el usuario y que lo dirija a un formulario de contacto especializado en el servicio seleccionado.
    - Sección Inmobiliaria (Catálogo de propiedades en venta/alquiler).
    - Sección Contacto (Formulario y ubicación).
    - Navegación fluida entre secciones mediante enlaces.
    - Optimización SEO experta (meta etiquetas, semántica).

- Parte privada:
    - Panel de administración (Dashboard protegido):
        - CRUD completo de Servicios ofrecidos.
        - CRUD completo de Inmuebles (Añadir fotos, precio, descripción, estado).
        - Gestión y visualización de los mensajes recibidos desde el correo corporativo.
    
    - Backend:
        - Haremos el backend en Supabase.
        - Login y registro de usuarios (solo administradores de Codecor) con Supabase Auth.
        - Se guardarán los datos de los inmuebles en una base de datos Supabase.
        - Se guardarán los servicios en una base de datos Supabase.

Stack de tecnología:
- HTML5
- CSS3 (sin frameworks)
- JavaScript Vanilla JS sin frameworks
- React (Exclusivamente si es necesario para el enrutamiento complejo del panel de administración, priorizando Vanilla JS para la parte pública)
- Supabase

Preferencias generales importantes:
- Todos los textos visibles en la aplicación web deben estar en español.
- HTML debe ser semántico.
- No uses alert, confirm, prompt, todo el feedback debe ser visual en el DOM (modales o notificaciones toast integradas).
- Prioriza que el código sea fácil de entender pero de calidad.

Preferencias de Diseño:
- Ajusta el diseño de la webapp usando la imagen de diseño que está disponible en @/design/screen.png, en el fichero @/design/DESIGN.md y en el código html del fichero @/design/code.html.
- Responsive (mobile first).
- El diseño debe ser corporativo, moderno, minimalista e intuitivo, transmitiendo confianza y profesionalidad.

Preferencias de estilos:
- Eliminar TailwindCSS (si el agente lo sugiere) y convertirlo todo a CSS nativo.
- Usa medidas en rem, usando un font-size base de 10px (ej. 1.6rem = 16px).
- Usa buenas prácticas de maquetación CSS y si es necesario usa flexbox y CSS grid layout.
- No uses estilos internos ni inline.
- Los estilos deben estar en el archivo style.css dentro de la carpeta correspondiente.

Preferencias de código:
- No añadas dependencias externas no solicitadas.
- HTML debe ser estrictamente semántico.
- No uses alert, confirm, prompt, todo el feedback debe ser visual en el dom.
- No uses innerHTML/outerHTML, todo el contenido dinámico debe ser insertado con appendChild, o previamente creando un elemento con document.createElement.
- Cuidado: no olvidar prevenir el default de los eventos en submits (formularios) o clicks de enlaces vacíos.
- Prioriza el código legible y mantenible.
- Prioriza que el código sea sencillo de entender por encima de soluciones excesivamente abstractas.
- Si el agente duda sobre la arquitectura de la base de datos o el diseño, que revise las especificaciones del proyecto y si no, que pregunte al usuario.
- El agente debe mantener una actitud proactiva y resolutiva.
- El agente debe tener una actitud colaborativa y respetuosa.
- El agente debe tener una actitud innovadora y creativa para resolver problemas de UI.

Estructuras de archivos:
- carpeta (design - contiene los diseños del proyecto)
- carpeta (assets)
    - carpeta (css)
    - carpeta (fonts)
    - carpeta (img)
    - carpeta (js)
- index.html
- AGENTS.md