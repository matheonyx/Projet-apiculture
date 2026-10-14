// initialisation de la carte avec leaflet

// verification si la personne est connectee
if (!sessionStorage.getItem('connecte')) {
    // redirige si pas connecte
    window.location.href = 'index.html';
}

// deconnexion
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', function () {
        sessionStorage.removeItem('connecte');
        window.location.href = 'index.html';
    });
}

// creation de la carte
let carte = null;

try {
    // vue par defaut
    carte = L.map('map').setView([49.8485, 3.2874], 13);

    // fond de carte openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(carte);

    // marqueur de test
    L.marker([49.8485, 3.2874]).addTo(carte)
        .bindPopup('ruche de test');

} catch (e) {
    // si erreur de chargement carte
    console.log('erreur chargement carte');
}
