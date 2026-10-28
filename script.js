
/* ========================================
   VENTANAS EXISTENTES
======================================== */

function abrirServicioCirugia() {
    abrirModal("ventanaServicioCirugia");
}

function cerrarServicioCirugia() {
    cerrarModal("ventanaServicioCirugia");
}

function abrirQuirofano() {
    abrirModal("ventanaQuirofano");
}

function cerrarQuirofano() {
    cerrarModal("ventanaQuirofano");
}

function abrirElectrobisturi() {
    abrirModal("ventanaElectrobisturi");
}

function cerrarElectrobisturi() {
    cerrarModal("ventanaElectrobisturi");
}

function abrirCarroAnestesia() {
    abrirModal("ventanaCarroAnestesia");
}

function cerrarCarroAnestesia() {
    cerrarModal("ventanaCarroAnestesia");
}

/* ========================================
   ABRIR Y CERRAR MODALES
======================================== */

function abrirModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.style.display = "flex";
    } else {
        console.warn("No se encontró la ventana:", id);
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.style.display = "none";
    }
}

/* ========================================
   CERRAR MODALES AL HACER CLIC AFUERA
======================================== */

window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});

/* ========================================
   VISTA GENERAL Y ÁREAS
======================================== */

function mostrarVistaGeneral() {
    document.querySelectorAll(".item-nav").forEach(function(boton) {
        boton.classList.remove("activo");
    });

    document.querySelectorAll(".item-nav")[0].classList.add("activo");
}

function seleccionarArea() {
    document.querySelectorAll(".item-nav").forEach(function(boton) {
        boton.classList.remove("activo");
    });

    document.querySelectorAll(".item-nav")[1].classList.add("activo");

    abrirInformacionArea();
}

function abrirInformacionArea() {
    abrirModal("ventanaArea");
}

/* ========================================
   SECCIONES INFERIORES
======================================== */

function mostrarSeccion(nombre) {
    const titulo = document.getElementById("tituloSeccion");
    const descripcion = document.getElementById("descripcionSeccion");

    titulo.textContent = nombre;

    const descripciones = {
        "Normativa":
            "Aquí se reunirán las normas y los requisitos aplicables al área y a sus equipos.",

        "Riesgos":
            "Aquí se documentarán los riesgos asociados a las instalaciones, al equipamiento y a su utilización.",

        "Mantenimiento":
            "Aquí se incorporarán las tareas de mantenimiento, verificaciones y registros correspondientes.",

        "Manuales":
            "Aquí se reunirán los manuales técnicos y la documentación de los equipos.",

        "Instalaciones":
            "Desde aquí se podrá consultar la información de arquitectura, electricidad, gases y climatización.",

        "Equipamiento":
            "Desde aquí se podrá consultar el inventario y abrir las fichas técnicas de los equipos.",

        "Gestión tecnológica":
            "Aquí se incorporará información sobre inventario, gestión y ciclo de vida de la tecnología médica.",

        "Área pendiente de incorporar":
            "Esta área se habilitará cuando esté disponible la información del hospital."
    };

    descripcion.textContent =
        descripciones[nombre] ||
        "El contenido de esta sección se incorporará posteriormente.";

    abrirModal("ventanaSeccion");
}

/* ========================================
   ZOOM DE LA VISTA GENERAL
======================================== */

let nivelZoom = 1;

function cambiarZoom(cambio) {
    nivelZoom = Math.min(3, Math.max(1, nivelZoom + cambio));
    actualizarZoom();
}

function restablecerZoom() {
    nivelZoom = 1;
    actualizarZoom();
}

function actualizarZoom() {
    const imagen = document.getElementById("imagenHospital");

    if (imagen) {
        imagen.style.transform = "scale(" + nivelZoom + ")";
    }
}

/* ========================================
   CAPAS TÉCNICAS
======================================== */

function cambiarCapa(nombre, boton) {
    document.querySelectorAll(".pestana").forEach(function(pestana) {
        pestana.classList.remove("activa");
    });

    boton.classList.add("activa");

    document.getElementById("tituloCapa").textContent = nombre;

    const descripciones = {
        "Arquitectura":
            "Distribución de ambientes, dimensiones y circulación.",

        "Eléctrica":
            "Planos de alimentación, tableros y circuitos eléctricos.",

        "Gases":
            "Distribución de redes y puntos de suministro de gases medicinales.",

        "Climatización":
            "Planos de ventilación y climatización del área."
    };

    document.getElementById("descripcionCapa").textContent =
        descripciones[nombre];

    // Por ahora las capas son demostrativas.
    // Más adelante se conectarán con los planos reales.
}
