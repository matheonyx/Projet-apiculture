let map = null;
let markers = [];
let currentRucheId = null;
let currentInterventionPage = 1;

function initMap() {
    try {
        map = L.map('map').setView([49.8485, 3.2874], 13);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'OpenStreetMap France'
        }).addTo(map);

        tiles.on('tileerror', function () {
            document.getElementById('view-map').classList.remove('active');
            document.getElementById('view-list').classList.add('active');
            document.getElementById('btn-toggle-view').textContent = 'Afficher Carte';
        });

        map.on('click', function (e) {
            document.getElementById('ruche-lat').value = e.latlng.lat.toFixed(5);
            document.getElementById('ruche-lng').value = e.latlng.lng.toFixed(5);
        });

        loadRuchesMap();
    } catch (e) {
        document.getElementById('view-map').classList.remove('active');
        document.getElementById('view-list').classList.add('active');
        document.getElementById('btn-toggle-view').textContent = 'Afficher Carte';
    }
}

function loadRuchesMap() {
    fetch('/api/ruches')
        .then(res => res.json())
        .then(ruches => {
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            ruches.forEach(ruche => {
                const marker = L.marker([ruche.lat, ruche.lng]).addTo(map);
                marker.bindPopup('<b>' + ruche.nom + '</b><br><button onclick="openConsultModal(' + ruche.id + ', \'' + ruche.nom.replace(/'/g, "\\'") + '\', ' + ruche.lat + ', ' + ruche.lng + ')" class="btn-primary" style="margin-top:5px;padding:4px 8px;font-size:12px;">Consulter</button>');
                markers.push(marker);
            });
        });
}

function openConsultModal(id, nom, lat, lng) {
    currentRucheId = id;
    currentInterventionPage = 1;

    document.getElementById('consult-ruche-title').textContent = nom + ' (' + lat + ', ' + lng + ')';
    document.getElementById('add-intervention-box').style.display = 'none';
    document.getElementById('intervention-text').value = '';

    renderInterventions();
    document.getElementById('modal-consult-ruche').classList.add('show');
}

function closeConsultModal() {
    document.getElementById('modal-consult-ruche').classList.remove('show');
}

function renderInterventions() {
    const listEl = document.getElementById('list-interventions');
    listEl.innerHTML = '';

    fetch('/api/ruche/' + currentRucheId + '/interventions?page=' + currentInterventionPage)
        .then(res => res.json())
        .then(data => {
            if (data.items.length === 0) {
                listEl.innerHTML = '<li class="intervention-empty">Aucune intervention enregistrée pour cette ruche.</li>';
                document.getElementById('pagination-controls').innerHTML = '';
                return;
            }

            data.items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = '<span class="intervention-date">' + item.date + '</span><div>' + item.texte + '</div>';
                listEl.appendChild(li);
            });

            renderPagination(data.totalPages);
        });
}

function renderPagination(totalPages) {
    const container = document.getElementById('pagination-controls');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const btnPrev = document.createElement('button');
    btnPrev.textContent = '«';
    btnPrev.disabled = currentInterventionPage === 1;
    btnPrev.onclick = () => {
        currentInterventionPage--;
        renderInterventions();
    };
    container.appendChild(btnPrev);

    for (let p = 1; p <= totalPages; p++) {
        const btnPage = document.createElement('button');
        btnPage.textContent = p;
        if (p === currentInterventionPage) btnPage.classList.add('active');
        btnPage.onclick = () => {
            currentInterventionPage = p;
            renderInterventions();
        };
        container.appendChild(btnPage);
    }

    const btnNext = document.createElement('button');
    btnNext.textContent = '»';
    btnNext.disabled = currentInterventionPage === totalPages;
    btnNext.onclick = () => {
        currentInterventionPage++;
        renderInterventions();
    };
    container.appendChild(btnNext);

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-indicator';
    pageInfo.textContent = 'Page ' + currentInterventionPage + ' / ' + totalPages;
    container.appendChild(pageInfo);
}

function openProductionModal() {
    document.getElementById('recolte-date').valueAsDate = new Date();
    document.getElementById('recolte-poids').value = '';

    renderChartAndTotal();
    document.getElementById('modal-production').classList.add('show');
}

function closeProductionModal() {
    document.getElementById('modal-production').classList.remove('show');
}

function renderChartAndTotal() {
    fetch('/api/ruche/' + currentRucheId + '/recoltes')
        .then(res => res.json())
        .then(data => {
            document.getElementById('recolte-total-kg').textContent = 'Total : ' + data.totalKg + ' kg';
            drawChart(data.moisPoids);
        });
}

function drawChart(dataObj) {
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const labels = Object.keys(dataObj);
    const values = Object.values(dataObj);
    const maxVal = Math.max(...values, 1000);

    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    ctx.strokeStyle = '#eeeeee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(width - paddingRight, paddingTop);
    ctx.moveTo(paddingLeft, paddingTop + chartHeight / 2);
    ctx.lineTo(width - paddingRight, paddingTop + chartHeight / 2);
    ctx.stroke();

    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(paddingLeft, height - paddingBottom);
    ctx.lineTo(width - paddingRight, height - paddingBottom);
    ctx.stroke();

    const barWidth = chartWidth / labels.length * 0.65;
    const gap = chartWidth / labels.length;

    labels.forEach((label, i) => {
        const val = values[i];
        const barHeight = (val / maxVal) * chartHeight;
        const x = paddingLeft + (i * gap) + (gap - barWidth) / 2;
        const y = height - paddingBottom - barHeight;

        ctx.fillStyle = '#f39c12';
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth / 2, height - paddingBottom + 16);

        if (val > 0) {
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.fillText(val + 'g', x + barWidth / 2, y - 5);
        }
    });

    ctx.fillStyle = '#777';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(maxVal + ' g', paddingLeft - 8, paddingTop + 10);
    ctx.fillText(Math.round(maxVal / 2) + ' g', paddingLeft - 8, paddingTop + chartHeight / 2 + 4);
    ctx.fillText('0 g', paddingLeft - 8, height - paddingBottom);
}

document.addEventListener('DOMContentLoaded', function () {
    initMap();

    const btnToggle = document.getElementById('btn-toggle-view');
    const viewMap = document.getElementById('view-map');
    const viewList = document.getElementById('view-list');

    btnToggle.addEventListener('click', function () {
        if (viewMap.classList.contains('active')) {
            viewMap.classList.remove('active');
            viewList.classList.add('active');
            btnToggle.textContent = 'Afficher Carte';
        } else {
            viewList.classList.remove('active');
            viewMap.classList.add('active');
            btnToggle.textContent = 'Afficher Liste';
            setTimeout(() => map.invalidateSize(), 100);
        }
    });

    const modalAdd = document.getElementById('modal-add-ruche');
    document.getElementById('btn-add-ruche').addEventListener('click', function () {
        document.getElementById('ruche-nom').value = '';
        if (!document.getElementById('ruche-lat').value) {
            document.getElementById('ruche-lat').value = '49.8485';
            document.getElementById('ruche-lng').value = '3.2874';
        }
        modalAdd.classList.add('show');
    });

    document.getElementById('btn-cancel-add-ruche').addEventListener('click', function () {
        modalAdd.classList.remove('show');
    });

    document.getElementById('btn-close-consult').addEventListener('click', closeConsultModal);

    document.getElementById('btn-trigger-add-intervention').addEventListener('click', function () {
        document.getElementById('add-intervention-box').style.display = 'block';
        document.getElementById('intervention-text').focus();
    });

    document.getElementById('btn-cancel-intervention').addEventListener('click', function () {
        document.getElementById('add-intervention-box').style.display = 'none';
        document.getElementById('intervention-text').value = '';
    });

    document.getElementById('intervention-text').addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            document.getElementById('btn-save-intervention').click();
        }
    });

    document.getElementById('btn-save-intervention').addEventListener('click', function () {
        const text = document.getElementById('intervention-text').value.trim();
        if (!text) return;

        const body = new URLSearchParams();
        body.append('texte', text);

        fetch('/api/ruche/' + currentRucheId + '/interventions/ajouter', {
            method: 'POST',
            body: body
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('add-intervention-box').style.display = 'none';
            document.getElementById('intervention-text').value = '';
            currentInterventionPage = 1;
            renderInterventions();
        });
    });

    document.getElementById('btn-open-production').addEventListener('click', openProductionModal);
    document.getElementById('btn-close-production').addEventListener('click', closeProductionModal);

    document.getElementById('form-add-recolte').addEventListener('submit', function (e) {
        e.preventDefault();
        const dateVal = document.getElementById('recolte-date').value;
        const poidsVal = parseInt(document.getElementById('recolte-poids').value, 10);

        if (!dateVal || isNaN(poidsVal) || poidsVal <= 0) return;

        const body = new URLSearchParams();
        body.append('date', dateVal);
        body.append('poids', poidsVal);

        fetch('/api/ruche/' + currentRucheId + '/recoltes/ajouter', {
            method: 'POST',
            body: body
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('recolte-poids').value = '';
            renderChartAndTotal();
        });
    });
});
