function abrirServicioCirugia() {
    document.getElementById("ventanaServicioCirugia").style.display = "flex";
}

function cerrarServicioCirugia() {
    document.getElementById("ventanaServicioCirugia").style.display = "none";
}

function abrirQuirofano() {
    document.getElementById("ventanaQuirofano").style.display = "flex";
}

function cerrarQuirofano() {
    document.getElementById("ventanaQuirofano").style.display = "none";
}

// Cerrar cualquiera de las ventanas si se hace clic fuera de ellas
window.onclick = function(event) {
    const ventanaServicio = document.getElementById("ventanaServicioCirugia");
    const ventanaQuirofano = document.getElementById("ventanaQuirofano");

    if (event.target === ventanaServicio) {
        ventanaServicio.style.display = "none";
    }
    if (event.target === ventanaQuirofano) {
        ventanaQuirofano.style.display = "none";
    }
};