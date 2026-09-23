// =========================================
// ABRIR SERVICIO DE CIRUGÍA
// =========================================

function abrirServicioCirugia() {

    document.getElementById("ventanaServicioCirugia").style.display = "block";

}


// =========================================
// CERRAR SERVICIO DE CIRUGÍA
// =========================================

function cerrarServicioCirugia() {

    document.getElementById("ventanaServicioCirugia").style.display = "none";

}


// =========================================
// ABRIR QUIRÓFANO
// =========================================

function abrirQuirofano() {

    document.getElementById("ventanaQuirofano").style.display = "block";

}


// =========================================
// CERRAR QUIRÓFANO
// =========================================

function cerrarQuirofano() {

    document.getElementById("ventanaQuirofano").style.display = "none";

}


// =========================================
// CERRAR AL HACER CLIC FUERA
// =========================================

window.onclick = function(event) {

    const ventanaServicio =
        document.getElementById("ventanaServicioCirugia");

    const ventanaQuirofano =
        document.getElementById("ventanaQuirofano");


    if (event.target === ventanaServicio) {

        ventanaServicio.style.display = "none";

    }


    if (event.target === ventanaQuirofano) {

        ventanaQuirofano.style.display = "none";

    }

};