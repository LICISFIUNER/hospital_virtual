
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
    mostrarFichaEquipo("ventanaCarroAnestesia", fichasEquipos.anestesia);
}

function cerrarCarroAnestesia() {
    cerrarModal("ventanaCarroAnestesia");
}
function abrirMonitor() {
    mostrarFichaEquipo("ventanaMonitor", fichasEquipos.monitor);
}

function cerrarMonitor() {
    cerrarModal("ventanaMonitor");
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
/* ========================================
   DATOS DE LAS FICHAS
   Editá acá los textos de cada equipo.
======================================== */

const fichasEquipos = {
    anestesia: {
        nombre: "Mesa de Anestesia",

        ecri: "10-134",

        // Escribí la ruta cuando tengas la imagen.
        // Por ejemplo: "imagenes/mesa-anestesia.jpg"
        foto: "imagenes/maquina_de_anestesia.jpg",

        descripcion:
            "Equipo biomédico diseñado para generar y mezclar gases médicos (O₂, Aire, N₂O) con agentes anestésicos volátiles, regulando la dosificación por inhalación para inducir y mantener la anestesia general.",

        uso:
            "Equipo biomédico diseñado para generar y mezclar gases médicos (O₂, Aire, N₂O) con agentes anestésicos volátiles, regulando la dosificación por inhalación para inducir y mantener la anestesia general.",

        requerimientos: [
            "Gases: O₂, Aire y N₂O ",
            "Eléctrico: 220V AC"
        ],

        accesorios: [
            "Vaporizadores",
            "Circuito respiratorio",
            "Canister con cal sodada",
            "Válvula APL"
        ],

        riesgos: [
            "Hipoxia difusional por falla en O₂",
            "Barotrauma por sobrepresión o mal ajuste de la válvula APL.",
            "Discrepancia en la concentración del anestésico por variaciones térmicas o dilución en bajo flujo.", 
            "Fugas de gases anestésicos al ambiente del quirófano."
        ],

        mitigacion: [
            "Sistema antihipóxico (límite mínimo de 27–30% de O₂)",
            "Válvula APL de seguridad para escape de exceso de gas.",
            "Vaporizadores compensados bimetálicamente. ",
            "Sistema Scavenging"
        ],

        mantenimiento: [
            "Calibración de celda de O₂",
            "Pruebas diarias de hermeticidad",
            "Reemplazo periódico de la cal sodada agotada. ",
            "Mantenimiento de válvulas y prueba de vaporizadores."

        ],

        enlaces: [
            {
                texto: "MeDevIS WHO (COM_300)",
                url: "https://medevis.who-healthtechnologies.org/devices/COM_300"
            },
            {
                texto: "MeDevIS WHO (COM_037)",
                url: "https://medevis.who-healthtechnologies.org/devices/COM_037"
            }
        ]
    },
monitor: {
        nombre: "Monitor Multiparamétrico",
        ecri: "12-647",
        foto: "imagenes/Monitor.png",

        descripcion: "Dispositivo electromédico diseñado para adquirir, procesar, visualizar en tiempo real y registrar continuamente múltiples parámetros fisiológicos vitales del paciente (ECG, frecuencia cardíaca, SpO₂, presión arterial no invasiva e invasiva, temperatura y capnografía/EtCO₂).",
        uso: "Vigilancia continua del estado hemodinámico y respiratorio de pacientes críticos, anestesiados o inestables en Unidades de Terapia Intensiva (UTI/UCI), quirófanos, guardias de emergencia y traslados intrahospitalarios.",

        requerimientos: [
            "Eléctrico: Red 220V"
        ],

        accesorios: [
            "Cable troncal y latiguillos de ECG (3, 5 o 12 derivaciones) + electrodos descartables",
            "Sensor de oximetría de pulso (SpO₂) adulto/pediátrico/neonatal y cable extensor",
            "Manguito (brazalete) de presión arterial no invasiva (PANI) y manguera neumática",
            "Sonda/sensor de temperatura cutánea o esofágica/rectal",
            "Línea de muestreo / sensor de capnografía (EtCO₂) y transductores de presión invasiva (opcional según complejidad)"
        ],
        riesgos: [
            "Falsas alarmas constantes o fatiga de alarmas que llevan a desatender eventos críticos reales",
            "Lecturas erróneas por interferencia electromagnética (electrobisturí), artefactos de movimiento o mala perfusión periférica",
            "Lesiones isquémicas o hematomas por inflado excesivo/frecuente del manguito de PANI",
            "Quemaduras cutáneas en el sitio del sensor de SpO₂ por presión prolongada o incompatibilidad de sensores",
            "Macro/microshock eléctrico por falla de aislamiento galvánico en conexiones al paciente (especialmente en presión invasiva/ECG)"
        ],

        mitigacion: [
            "Configuración personalizada de límites de alarma fisiológicos y jerarquización sonora/visual",
            "Filtros de rechazo de alta frecuencia (modo cirugía) y aislamiento tipo CF a prueba de desfibrilación en entradas de paciente",
            "Rotación periódica del sitio de colocación del sensor de SpO₂ y selección del tamaño adecuado de brazalete PANI",
            "Uso exclusivo de sensores y cables compatibles certificados por el fabricante"
        ],

        mantenimiento: [
            "Verificación anual de exactitud de parámetros con simulador de paciente multiparamétrico (ECG, SpO₂, PANI, temperatura)",
            "Pruebas de seguridad eléctrica según norma IEC 60601-1 (corrientes de fuga y resistencia de puesta a tierra)",
            "Control de estanqueidad neumática y calibración del manómetro de presión no invasiva (PANI)",
            "Inspección visual de cables, conectores y verificación de capacidad de carga de la batería interna"
        ],

        enlaces: [
            { texto: "Medevis WHO (COM_019 - Monitor Multiparamétrico)", 
             url: "https://medevis.who-healthtechnologies.org/devices/COM_019" },
            { texto: "Medevis WHO (CSD_385 - Monitor de Signos Vitales)",
             url: "https://medevis.who-healthtechnologies.org/devices/CSD_385" }
        ]
    }
};


/* ========================================
   PLANTILLA GENERAL DE LAS FICHAS
======================================== */

function mostrarFichaEquipo(idVentana, equipo) {
    const ventana = document.getElementById(idVentana);

    if (!ventana || !equipo) {
        console.error("Falta la ventana o los datos del equipo:", idVentana);
        return;
    }

    const espacio = ventana.querySelector(".datos-ficha");

    if (!espacio) {
        console.error(
            "Falta el contenedor con class=\"datos-ficha\" dentro de:",
            idVentana
        );
        return;
    }

    // Encabezado con nombre y código ECRI.
    const encabezado = document.createElement("header");

    const nombre = document.createElement("h2");
    nombre.textContent = equipo.nombre;
    encabezado.append(nombre);

    if (equipo.ecri) {
        const codigo = document.createElement("span");
        codigo.textContent = "ECRI: " + equipo.ecri;
        encabezado.append(codigo);
    }

    // Cuerpo de la ficha.
    const cuerpo = document.createElement("div");
    const informacion = document.createElement("div");

    cuerpo.append(informacion);

    // Secciones compartidas por todos los equipos.
    const secciones = [
        ["Descripción", equipo.descripcion],
        ["Uso principal", equipo.uso],
        ["Requerimientos", equipo.requerimientos],
        ["Accesorios necesarios", equipo.accesorios],
        ["Principales riesgos", equipo.riesgos],
        ["Medidas de mitigación", equipo.mitigacion],
        ["Mantenimiento y calibración", equipo.mantenimiento]
    ];

    for (const [titulo, contenido] of secciones) {
        // Las secciones vacías se ocultan.
        if (!contenido || contenido.length === 0) {
            continue;
        }

        const subtitulo = document.createElement("h3");
        subtitulo.textContent = titulo;
        informacion.append(subtitulo);

        if (Array.isArray(contenido)) {
            const lista = document.createElement("ul");

            for (const texto of contenido) {
                const item = document.createElement("li");
                item.textContent = texto;
                lista.append(item);
            }

            informacion.append(lista);
        } else {
            const parrafo = document.createElement("p");
            parrafo.textContent = contenido;
            informacion.append(parrafo);
        }
    }

    // Enlaces externos.
    if (equipo.enlaces && equipo.enlaces.length > 0) {
        const tituloEnlaces = document.createElement("h3");
        tituloEnlaces.textContent = "Enlaces";
        informacion.append(tituloEnlaces);

        const listaEnlaces = document.createElement("ul");

        for (const enlace of equipo.enlaces) {
            const item = document.createElement("li");
            const link = document.createElement("a");

            link.textContent = enlace.texto;
            link.href = enlace.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            item.append(link);
            listaEnlaces.append(item);
        }

        informacion.append(listaEnlaces);
    }

    // Foto a la derecha, cuando se haya indicado una ruta.
    if (equipo.foto) {
        const columnaFoto = document.createElement("div");
        const imagen = document.createElement("img");

        imagen.src = equipo.foto;
        imagen.alt = equipo.nombre;

        columnaFoto.append(imagen);
        cuerpo.append(columnaFoto);
    } else {
        cuerpo.classList.add("sin-foto");
    }

    // Actualiza el contenido y abre la ventana.
    espacio.replaceChildren(encabezado, cuerpo);
    abrirModal(idVentana);
}
