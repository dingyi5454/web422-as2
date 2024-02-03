var page = 1;
const perPage = 10;
let searchName = null;

function loadListingsData() {
    let apiBaseUrl = 'https://byzantium-lobster-ring.cyclic.app/';
    let url = `${apiBaseUrl}api/listings?page=${page}&perPage=${perPage}`;
    if (searchName !== null) {
        url += `&name=${searchName}`;
    }

    fetch(url)
        .then(res => {
            return res.ok ? res.json() : Promise.reject(res.status);
        })
        .then(data => {
            if (data.length) {
                createAndUpdateListings(data);
                updateCurrentPageDisplay();
                addClickEventsToRows();
            } else {
                if (page > 1) {
                    page--;
                    loadListingsData();
                } else {
                    showNoDataAvailableRow();
                    updateCurrentPageDisplay();
                }
            }
        })
        .catch(err => {
            console.error('Error fetching listings:', err);
        });
}

function createAndUpdateListings(data) {
    const tbody = document.getElementById('listingTableBody');
    tbody.innerHTML = ''; 

    data.forEach(listing => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', listing._id);

        const tdName = document.createElement('td');
        tdName.textContent = listing.name;

        const tdType = document.createElement('td');
        tdType.textContent = listing.room_type;

        const tdLocation = document.createElement('td');
        tdLocation.textContent = listing.address.street;

        const tdSummary = document.createElement('td');
        tdSummary.innerHTML = listing.summary;

        tr.appendChild(tdName);
        tr.appendChild(tdType);
        tr.appendChild(tdLocation);
        tr.appendChild(tdSummary);

        tbody.appendChild(tr);
    });
}

function updateCurrentPageDisplay() {
    const currentPageElement = document.getElementById('current-page');
    currentPageElement.querySelector('a').textContent = `Page ${page}`;
}

function addClickEventsToRows() {
    const rows = document.querySelectorAll('#listingTableBody tr');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const listingId = row.getAttribute('data-id');
            fetch(`/api/listings/${listingId}`)
                .then(res => res.json())
                .then(listingDetails => {
                    document.querySelector('.modal-title').textContent = listingDetails.name;
                    const modalBody = document.querySelector('.modal-body');
                    modalBody.innerHTML = `<img id="photo" onerror="this.onerror=null;this.src = 'https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${listingDetails.images.picture_url}" /><br><br>${listingDetails.neighborhood_overview}<br><br><strong>Price:</strong> ${listingDetails.price.toFixed(2)}<br><strong>Room:</strong> ${listingDetails.room_type}<br><strong>Bed:</strong> ${listingDetails.bed_type} (${listingDetails.beds})<br><br>`;
                    $('#detailsModal').modal('show');
                })
                .catch(err => {
                    console.error('Error fetching listing details:', err);
                });
        });
    });
}

function showNoDataAvailableRow() {
    const tbody = document.getElementById('listingTableBody');
    tbody.innerHTML = `<tr><td colspan="4"><strong>No data available</td></tr>`;
}

document.addEventListener('DOMContentLoaded', function() {
    loadListingsData();
});
document.getElementById('previous-page').addEventListener('click', function() {
    if (page > 1) {
        page--;
        loadListingsData();
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    page++;
    loadListingsData();
});

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    searchName = document.getElementById('name').value;
    page = 1;
    loadListingsData();
});

document.getElementById('clearForm').addEventListener('click', function() {
    document.getElementById('name').value = '';
    searchName = null;
    page = 1;
    loadListingsData();
});

document.addEventListener('DOMContentLoaded', function() {
});
