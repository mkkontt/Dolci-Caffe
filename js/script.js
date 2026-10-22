document.addEventListener("DOMContentLoaded", function () {
    console.log("Portal de Dolci & Caffè cargado correctamente.");

    iniciarContadorCaracteres();
    iniciarValidacionFormulario();
});

// 1. Evento 'input' para contar los caracteres de la descripción
function iniciarContadorCaracteres() {
    const textarea = document.getElementById("descripcion");
    const contador = document.getElementById("contadorCaracteres");

    if (!textarea || !contador) return;

    textarea.addEventListener("input", function () {
        const longitudActual = this.value.length;
        const limiteMaximo = this.getAttribute("maxlength") || 200;
        
        // Modificación del DOM para actualizar el contador
        contador.textContent = `Caracteres: ${longitudActual} / ${limiteMaximo}`;

        // Alerta visual al acercarse al límite
        if (longitudActual >= limiteMaximo) {
            contador.style.color = "red";
        } else {
            contador.style.color = "#666";
        }
    });
}

// 2. Evento 'submit', validaciones y almacenamiento en localStorage
function iniciarValidacionFormulario() {
    const formulario = document.getElementById("formularioContacto");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Detener el envío estándar del formulario

        // Obtención de elementos del DOM
        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const telefono = document.getElementById("telefono");
        const descripcion = document.getElementById("descripcion");

        // Expresión regular para validar formato básico de correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let esValido = true;

        // Validar campos obligatorios
        [nombre, correo, telefono, descripcion].forEach(function (campo) {
            if (campo.value.trim() === "") {
                campo.style.borderColor = "red";
                esValido = false;
            } else {
                campo.style.borderColor = "";
            }
        });

        if (!esValido) {
            alert("Por favor, llena todos los campos obligatorios.");
            return;
        }

        // Validar formato de correo
        if (!regexEmail.test(correo.value.trim())) {
            alert("Por favor, ingresa un correo electrónico válido.");
            correo.style.borderColor = "red";
            return;
        }

        // Construir objeto de la solicitud
        const nuevaSolicitud = {
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            descripcion: descripcion.value.trim(),
            fechaRegistro: new Date().toISOString()
        };

        // Guardar la información en localStorage
        try {
            const solicitudes = JSON.parse(localStorage.getItem("solicitudesCafe") || "[]");
            solicitudes.push(nuevaSolicitud);
            localStorage.setItem("solicitudesCafe", JSON.stringify(solicitudes));
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
            alert("Hubo un error al guardar tu solicitud en el navegador.");
            return;
        }

        // Mensaje de confirmación
        alert("¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.");

        // Limpieza del formulario y contador
        formulario.reset();
        document.getElementById("contadorCaracteres").textContent = "Caracteres: 0 / 200";
    });

    // Resetear colores al presionar el botón de limpiar
    formulario.addEventListener("reset", function () {
        const campos = formulario.querySelectorAll("input, textarea");
        campos.forEach(campo => campo.style.borderColor = "");
        document.getElementById("contadorCaracteres").textContent = "Caracteres: 0 / 200";
    });
}