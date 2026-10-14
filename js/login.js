// script de connexion basique

const form = document.getElementById('form-login');
const erreur = document.getElementById('erreur');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // recupere les valeurs
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    // test simple pour le moment
    if (u === 'apiculteur' && p === '1234') {
        // stocke pour savoir si connecte
        sessionStorage.setItem('connecte', 'oui');
        window.location.href = 'apiculteur.html';
    } else {
        // affiche le message rouge
        erreur.style.display = 'block';
    }
});
