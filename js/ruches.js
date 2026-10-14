// fichier pour gerer les ruches

// bouton ouvrir modale
const btnAdd = document.getElementById('btn-add-ruche');
const modal = document.getElementById('modal-ajout');
const btnClose = document.getElementById('btn-fermer-modal');

if (btnAdd && modal) {
    btnAdd.addEventListener('click', function () {
        // affiche la modale
        modal.style.display = 'flex';
    });
}

if (btnClose && modal) {
    btnClose.addEventListener('click', function () {
        // cache la modale
        modal.style.display = 'none';
    });
}

// fonction a completer plus tard
function ajouterRuche() {
    // a faire avec le localstorage
}

function supprimerRuche() {
    // a faire avec confirmation
}
