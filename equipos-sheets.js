/* Hospital virtual: fichas desde Google Sheets.
   Cargar después de script.js y Papa Parse.
   Configurar data-csv en index.html.
   Conserva el formato de mostrarFichaEquipo()
   y las clases de estilo existentesd. */

(function () {
    "use strict";

    const csvUrl = (
        document.currentScript?.dataset.csv || ""
    ).trim();

    const idModal = "ventanaFichaEquipoSheets";

    const antiguos = {
        anestesia: {
            abrir: "abrirCarroAnestesia",
            clase: ".referencia-anestesia"
        },
        monitor: {
            abrir: "abrirMonitor",
            clase: ".referencia-monitor"
        },
        electrobisturi: {
            abrir: "abrirElectrobisturi",
            clase: ".referencia-electrobisturi"
        }
    };

    let equipos = new Map();

    let lista;
    let estado;
    let actualizar;
    let modal;
    let cierre;
    let fichaAbierta;
    let focoAnterior;

    let cargando = false;

    const displayOriginal = new WeakMap();

    const texto = valor => String(valor ?? "").trim();

    const renglones = valor =>
        texto(valor)
            .split(/\r?\n/)
            .map(texto)
            .filter(Boolean);

    /* ========================================
       VALIDAR ENLACES E IMÁGENES
    ======================================== */

    function urlSegura(valor, relativa = false) {
        const original = texto(valor);

        if (!original) return "";

        let url;

        try {
            url = new URL(
                original,
                relativa ? document.baseURI : undefined
            );
        } catch {
            throw new Error(
                "Hay una dirección inválida: " + original
            );
        }

        if (!["https:", "http:"].includes(url.protocol)) {
            throw new Error(
                "Los enlaces y las fotos deben usar HTTP o HTTPS."
            );
        }

        return url.href;
    }

    /* ========================================
       CONVERTIR UNA FILA EN DATOS DE UN EQUIPO
    ======================================== */

    function normalizar(fila) {
        const id = texto(fila.id);
        const nombre = texto(fila.nombre);

        if (!id || !nombre) {
            throw new Error(
                "Cada equipo necesita id y nombre."
            );
        }

        if (!/^[a-z0-9_\-]+$/.test(id)) {
            throw new Error(
                'El id "' + id +
                '" debe usar minúsculas, números, guiones o guiones bajos.'
            );
        }

        const x = texto(fila.posicion_x);
        const y = texto(fila.posicion_y);

        if (Boolean(x) !== Boolean(y)) {
            throw new Error(
                id + ": completá ambas posiciones o dejá ambas vacías."
            );
        }

        const posicion = valor =>
            Number(valor.replace(",", "."));

        if (
            x &&
            ![posicion(x), posicion(y)].every(
                n => Number.isFinite(n) && n >= 0 && n <= 100
            )
        ) {
            throw new Error(
                id + ": las posiciones deben estar entre 0 y 100."
            );
        }

        const resultado = {
            id: id,
            nombre: nombre,
            ecri: texto(fila.ecri),
            foto: urlSegura(fila.foto, true),
            descripcion: texto(fila.descripcion),
            uso: texto(fila.uso),
            referencia: texto(fila.referencia),

            posicion_x: x ? posicion(x) : null,
            posicion_y: y ? posicion(y) : null,

            enlaces: renglones(fila.enlaces).map(linea => {
                const corte = linea.indexOf("|");

                const url = urlSegura(
                    corte < 0
                        ? linea
                        : linea.slice(corte + 1)
                );

                if (!url) {
                    throw new Error(
                        id + ": falta la URL de un enlace."
                    );
                }

                return {
                    texto: corte < 0
                        ? url
                        : texto(linea.slice(0, corte)) || url,
                    url: url
                };
            })
        };

        const camposConListas = [
            "requerimientos",
            "accesorios",
            "riesgos",
            "mitigacion",
            "mantenimiento"
        ];

        for (const campo of camposConListas) {
            resultado[campo] = renglones(fila[campo]);
        }

        return resultado;
    }

    /* ========================================
       LEER EL CSV DE GOOGLE SHEETS
    ======================================== */

    function leerCsv(contenido) {
        if (/^\s*</.test(contenido)) {
            throw new Error(
                "El enlace devuelve una página HTML. " +
                "Publicá la pestaña Equipos como CSV."
            );
        }

        const resultado = Papa.parse(contenido, {
            header: true,
            delimiter: ",",
            skipEmptyLines: "greedy",
            dynamicTyping: false,

            transformHeader: cabecera =>
                cabecera.replace(/^\uFEFF/, "").trim()
        });

        if (resultado.errors.length) {
            throw new Error(
                "No se pudo leer el CSV: " +
                resultado.errors[0].message
            );
        }

        if (
            Object.keys(
                resultado.meta.renamedHeaders || {}
            ).length
        ) {
            throw new Error(
                "Hay encabezados de columna repetidos."
            );
        }

        for (const campo of ["id", "nombre"]) {
            if (!resultado.meta.fields?.includes(campo)) {
                throw new Error(
                    'Falta la columna "' + campo +
                    '". Revisá la fila 1 y la pestaña publicada.'
                );
            }
        }

        const nuevos = new Map();

        resultado.data.forEach((fila, indice) => {
            try {
                const equipo = normalizar(fila);

                if (nuevos.has(equipo.id)) {
                    throw new Error(
                        'El id "' + equipo.id + '" está repetido.'
                    );
                }

                nuevos.set(equipo.id, equipo);
            } catch (error) {
                throw new Error(
                    "Registro " + (indice + 1) +
                    ": " + error.message
                );
            }
        });

        return nuevos;
    }

    /* ========================================
       MENSAJES EN LA PÁGINA
    ======================================== */

    function informar(mensaje, error = false) {
        estado.textContent = mensaje;
        estado.style.color = error ? "#b42318" : "#475569";
    }

    /* ========================================
       ABRIR Y CERRAR LA FICHA
    ======================================== */

    function cerrarFicha() {
        modal.style.display = "none";
        fichaAbierta = null;

        if (focoAnterior?.isConnected) {
            focoAnterior.focus();
        }
    }

    function abrirFicha(id) {
        const equipo = equipos.get(id);

        if (!equipo) {
            informar(
                'No está el equipo "' + id + '" en la planilla.',
                true
            );
            return;
        }

        if (!fichaAbierta) {
            focoAnterior = document.activeElement;
        }

        fichaAbierta = id;

        mostrarFichaEquipo(idModal, equipo);

        modal.setAttribute("aria-label", equipo.nombre);

        // Si la foto falla, ocultamos la imagen rota.
        const foto = modal.querySelector("img");

        if (foto) {
            foto.addEventListener(
                "error",
                () => {
                    foto.hidden = true;
                },
                { once: true }
            );
        }

        cierre.focus();
    }

    /* ========================================
       CREAR UNA VENTANA COMPARTIDA
       PARA LAS FICHAS DE TODOS LOS EQUIPOS
    ======================================== */

    function crearVentana() {
        modal = document.createElement("div");
        modal.id = idModal;
        modal.className = "modal ficha-equipo";
        modal.style.display = "none";

        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");

        const contenido = document.createElement("div");
        contenido.className = "modal-contenido";

        cierre = document.createElement("button");
        cierre.type = "button";
        cierre.className = "cerrar";
        cierre.textContent = "×";
        cierre.setAttribute("aria-label", "Cerrar ficha");
        cierre.addEventListener("click", cerrarFicha);

        const datos = document.createElement("div");
        datos.className = "datos-ficha";

        contenido.append(cierre, datos);
        modal.append(contenido);
        document.body.append(modal);

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                cerrarFicha();
            }
        });

        document.addEventListener("keydown", event => {
            if (!fichaAbierta) return;

            if (event.key === "Escape") {
                event.preventDefault();
                cerrarFicha();
            }

            if (event.key === "Tab") {
                const focos = [
                    ...modal.querySelectorAll("button, a[href]")
                ];

                const primero = focos[0];
                const ultimo = focos[focos.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === primero
                ) {
                    event.preventDefault();
                    ultimo.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === ultimo
                ) {
                    event.preventDefault();
                    primero.focus();
                }
            }
        });
    }

    /* ========================================
       CREAR LOS BOTONES Y LOS MARCADORES
    ======================================== */

    function renderizar() {
        const fragmento = document.createDocumentFragment();

        for (const equipo of equipos.values()) {
            const articulo = document.createElement("article");
            articulo.className = "equipo";
            articulo.dataset.equipoId = equipo.id;

            const icono = document.createElement("div");
            icono.className = "icono-equipo";
            icono.textContent = "▣";
            icono.setAttribute("aria-hidden", "true");

            const datos = document.createElement("div");
            datos.className = "datos-equipo";

            const titulo = document.createElement("h3");
            titulo.textContent = equipo.nombre;
            datos.append(titulo);

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "boton-ficha";
            boton.textContent = "Ver ficha";

            boton.setAttribute(
                "aria-label",
                "Ver ficha: " + equipo.nombre
            );

            boton.addEventListener("click", () => {
                abrirFicha(equipo.id);
            });

            articulo.append(icono, datos, boton);
            fragmento.append(articulo);
        }

        lista.replaceChildren(fragmento);

        // Conectar los botones anteriores a las fichas de Sheets.
        for (const [id, opciones] of Object.entries(antiguos)) {
            window[opciones.abrir] = () => abrirFicha(id);

            document.querySelectorAll(opciones.clase)
                .forEach(marcador => {
                    if (!displayOriginal.has(marcador)) {
                        displayOriginal.set(
                            marcador,
                            marcador.style.display
                        );
                    }

                    const equipo = equipos.get(id);

                    marcador.style.display =
                        equipo && equipo.posicion_x === null
                            ? displayOriginal.get(marcador)
                            : "none";
                });
        }

        // Crear marcadores cuando haya coordenadas en Sheets.
        document.querySelectorAll(".plano-quirofano")
            .forEach(plano => {
                plano.querySelectorAll(".referencia-sheets")
                    .forEach(boton => boton.remove());

                if (getComputedStyle(plano).position === "static") {
                    plano.style.position = "relative";
                }

                for (const equipo of equipos.values()) {
                    if (equipo.posicion_x === null) continue;

                    const marcador = document.createElement("button");
                    marcador.type = "button";
                    marcador.className = "referencia referencia-sheets";
                    marcador.textContent =
                        equipo.referencia || equipo.nombre;
                    marcador.title = equipo.nombre;

                    marcador.setAttribute(
                        "aria-label",
                        "Ver ficha: " + equipo.nombre
                    );

                    Object.assign(marcador.style, {
                        position: "absolute",
                        left: equipo.posicion_x + "%",
                        top: equipo.posicion_y + "%",
                        transform: "translate(-50%, -50%)"
                    });

                    marcador.addEventListener("click", () => {
                        abrirFicha(equipo.id);
                    });

                    plano.append(marcador);
                }
            });

        if (fichaAbierta) {
            if (equipos.has(fichaAbierta)) {
                abrirFicha(fichaAbierta);
            } else {
                cerrarFicha();
            }
        }
    }

    /* ========================================
       DESCARGAR Y ACTUALIZAR LOS DATOS
    ======================================== */

    async function cargar() {
        if (cargando) return;

        cargando = true;
        actualizar.disabled = true;
        informar("Cargando fichas…");

        const controlador = new AbortController();

        const temporizador = setTimeout(() => {
            controlador.abort();
        }, 15000);

        try {
            if (
                typeof window.mostrarFichaEquipo !== "function" ||
                typeof window.abrirModal !== "function"
            ) {
                throw new Error(
                    "Revisá script.js: falta mostrarFichaEquipo() " +
                    "o hay un error de sintaxis."
                );
            }

            if (!window.Papa) {
                throw new Error(
                    "No se cargó Papa Parse. Revisá la conexión " +
                    "y el orden de las tres etiquetas script."
                );
            }

            const url = urlSegura(csvUrl);

            if (!url) {
                throw new Error(
                    "Pegá el enlace CSV publicado en data-csv, " +
                    "en index.html."
                );
            }

            const respuesta = await fetch(url, {
                cache: "no-store",
                credentials: "omit",
                signal: controlador.signal
            });

            if (!respuesta.ok) {
                throw new Error(
                    "Google devolvió un error HTTP " +
                    respuesta.status +
                    ". Revisá la publicación de la hoja."
                );
            }

            const nuevos = leerCsv(await respuesta.text());

            equipos = nuevos;
            renderizar();

            informar(
                equipos.size + " equipos cargados desde Google Sheets."
            );
        } catch (error) {
            let mensaje;

            if (error.name === "AbortError") {
                mensaje = "La carga tardó demasiado. Probá de nuevo.";
            } else if (error instanceof TypeError) {
                mensaje =
                    "No se pudo acceder a la hoja. Revisá la conexión " +
                    "y que esté publicada como CSV.";
            } else {
                mensaje = error.message;
            }

            informar(
                mensaje + " Se conserva el listado anterior.",
                true
            );

            console.warn("Fichas de Google Sheets:", mensaje);
        } finally {
            clearTimeout(temporizador);
            cargando = false;
            actualizar.disabled = false;
        }
    }

    /* ========================================
       INICIAR LA INTEGRACIÓN
    ======================================== */

    function iniciar() {
        lista = document.querySelector(".lista-equipos");

        const controles = document.createElement("div");
        controles.id = "controlesFichasSheets";

        Object.assign(controles.style, {
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            margin: "16px 0"
        });

        estado = document.createElement("p");
        estado.setAttribute("role", "status");
        estado.setAttribute("aria-live", "polite");

        actualizar = document.createElement("button");
        actualizar.type = "button";
        actualizar.className = "boton-ficha";
        actualizar.textContent = "Actualizar fichas";
        actualizar.addEventListener("click", cargar);

        controles.append(actualizar, estado);

        if (!lista) {
            document.body.prepend(controles);
            actualizar.disabled = true;

            informar(
                'Falta <div class="lista-equipos"></div> en index.html.',
                true
            );

            return;
        }

        lista.before(controles);
        crearVentana();

        window.actualizarFichas = cargar;
        window.abrirFichaEquipo = abrirFicha;

        // Uso opcional desde JavaScript.
        // Cambia solo esta sesión del navegador.
        // Para guardar para todas las personas,
        // agregá la fila en Google Sheets.
        window.addNuevoEquipo = fila => {
            if (cargando) {
                throw new Error(
                    "Esperá a que termine la carga de la planilla."
                );
            }

            if (typeof window.mostrarFichaEquipo !== "function") {
                throw new Error(
                    "Falta mostrarFichaEquipo() en script.js."
                );
            }

            const equipo = normalizar(fila);
            equipos.set(equipo.id, equipo);

            renderizar();

            informar(
                equipos.size +
                " equipos. Cambio local sin guardar en Google Sheets."
            );
        };

        cargar();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar,
            { once: true }
        );
    } else {
        iniciar();
    }
})();
