document.addEventListener("DOMContentLoaded", function () {
    console.log("Portal de Aroma & Café cargado correctamente.");

    iniciarReloj();
    iniciarContadorCaracteres();
    iniciarValidacionFormulario();
});

// 1. Reloj dinámico en formato de 12 horas en el encabezado
function iniciarReloj() {
    // Uso del DOM: Acceso a elemento por selector CSS
    const header = document.querySelector("header");
    if (!header) return;

    let reloj = document.getElementById("reloj");

    if (!reloj) {
        // Uso del DOM: Creación y modificación de elementos
        reloj = document.createElement("p");
        reloj.id = "reloj";
        reloj.style.fontWeight = "bold";
        reloj.style.marginTop = "0.5rem";
        header.appendChild(reloj);
    }

    function actualizarHora() {
        const ahora = new Date();
        let horas = ahora.getHours();
        const minutos = String(ahora.getMinutes()).padStart(2, "0");
        const segundos = String(ahora.getSeconds()).padStart(2, "0");
        const periodo = horas >= 12 ? "PM" : "AM";

        horas = horas % 12 || 12; // Formato de 12 horas
        const horaFormato = String(horas).padStart(2, "0");

        // Uso del DOM: Modificación del contenido de texto
        reloj.textContent = `Hora actual: ${horaFormato}:${minutos}:${segundos} ${periodo}`;
    }

    actualizarHora();
    setInterval(actualizarHora, 1000);
}

// 2. Detectar el evento 'input' para contar los caracteres en tiempo real
function iniciarContadorCaracteres() {
    // Uso del DOM: Obtener elementos por ID
    const textarea = document.getElementById("descripcion");
    const contador = document.getElementById("contadorCaracteres");

    if (!textarea || !contador) return;

    // Detección del evento input
    textarea.addEventListener("input", function () {
        const longitudActual = this.value.length;
        const limiteMaximo = this.getAttribute("maxlength") || 200;

        // Uso del DOM: Modificación del texto y estilos del contador
        contador.textContent = `Caracteres: ${longitudActual} / ${limiteMaximo}`;

        if (longitudActual >= limiteMaximo) {
            contador.style.color = "red";
        } else {
            contador.style.color = "#666";
        }
    });
}

// 3. Detectar evento 'submit', validar campos/correo y guardar en localStorage
function iniciarValidacionFormulario() {
    const formulario = document.getElementById("formularioContacto");

    if (!formulario) return;

    // Detección del evento submit
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Evita el recargado automático de la página

        // Uso del DOM: Lectura de elementos y valores
        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const telefono = document.getElementById("telefono");
        const descripcion = document.getElementById("descripcion");

        // Expresión regular para verificar el formato del correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let esValido = true;

        // Validar campos obligatorios vacíos
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

        // Validar formato de correo electrónico
        if (!regexEmail.test(correo.value.trim())) {
            alert("Por favor, ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).");
            correo.style.borderColor = "red";
            return;
        }

        // Construcción del objeto de registro
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
            alert("No se pudo guardar la información localmente.");
            return;
        }

        // Mensaje de confirmación al completar correctamente el formulario
        alert("¡Solicitud registrada con éxito! Gracias por contactar a Aroma & Café.");

        // Limpieza del formulario y reseteo del contador en el DOM
        formulario.reset();
        document.getElementById("contadorCaracteres").textContent = "Caracteres: 0 / 200";
    });

    // Restaurar los bordes al presionar el botón Limpiar
    formulario.addEventListener("reset", function () {
        const campos = formulario.querySelectorAll("input, textarea");
        campos.forEach(campo => campo.style.borderColor = "");
        document.getElementById("contadorCaracteres").textContent = "Caracteres: 0 / 200";
    });
}