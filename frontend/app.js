const API_BASE = 'http://localhost:5001/api';

document.addEventListener('DOMContentLoaded', async () => {
    await setupDummyAuth();

    if (document.getElementById('providerDashboard')) { }
    if (document.getElementById('providerCreateForm')) initProviderCreate();
    if (document.getElementById('providerHistoryList')) initProviderHistory();
    
    if (document.getElementById('shelterDashboard')) { }
    if (document.getElementById('shelterSearchList')) initShelterSearch();
    if (document.getElementById('shelterHistoryList')) initShelterHistory();
});

async function setupDummyAuth() {
    try {
        if (!localStorage.getItem('demoProviderId')) {
            const pRes = await fetch(`${API_BASE}/providers/all`);
            const pData = await pRes.json();
            if(pData.length > 0) localStorage.setItem('demoProviderId', pData[0]._id);
        }
        if (!localStorage.getItem('demoShelterId')) {
            const sRes = await fetch(`${API_BASE}/shelters/all`);
            const sData = await sRes.json();
            if(sData.length > 0) localStorage.setItem('demoShelterId', sData[0]._id);
        }
    } catch(e) {}
}

function loginAs(role) {
    localStorage.setItem('userRole', role);
    if (role === 'provider') window.location.href = 'provider-dashboard.html';
    else window.location.href = 'shelter-dashboard.html';
}

function logout() {
    localStorage.removeItem('userRole');
}

// === FOOD PROVIDER FLOW ===

async function initProviderCreate() {
    // Fulfils the 'Update / Edit' criteria
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if(editId) {
        document.getElementById('formActionTitle').textContent = "Update Existing Listing";
        document.getElementById('submitBtnText').textContent = "Update Donation";
        document.getElementById('editDonationId').value = editId;
        
        try {
            const res = await fetch(`${API_BASE}/donations/${editId}`);
            const data = await res.json();
            document.getElementById('foodName').value = data.foodName;
            document.getElementById('quantity').value = data.quantity;
            document.getElementById('unit').value = data.unit;
            document.getElementById('category').value = data.category;
        } catch(e) { console.error(e); }
    }

    document.getElementById('providerCreateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('editDonationId').value;
        const payload = {
            providerId: localStorage.getItem('demoProviderId'),
            foodName: document.getElementById('foodName').value,
            category: document.getElementById('category').value,
            quantity: document.getElementById('quantity').value,
            unit: document.getElementById('unit').value,
            status: 'available' // Reset to available upon editing
        };
        
        if (existingId) {
            await fetch(`${API_BASE}/donations/${existingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            alert("Entry successfully updated!");
        } else {
            await fetch(`${API_BASE}/donations/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            alert("Donation posted successfully!");
        }
        window.location.href = 'provider-history.html';
    });
}

function editDonation(id) {
    window.location.href = `provider-create.html?edit=${id}`;
}

async function initProviderHistory() {
    const list = document.getElementById('providerHistoryList');
    list.innerHTML = '<div class="card text-center">Loading network...</div>';
    
    const res = await fetch(`${API_BASE}/donations/all`);
    const data = await res.json();
    
    const myId = localStorage.getItem('demoProviderId');
    const myDonations = data.filter(d => d.providerId && (d.providerId._id || d.providerId) === myId);
    
    list.innerHTML = '';
    if(myDonations.length === 0) {
        list.innerHTML = '<div class="card text-center">No donations found yet! Provide food to see it here.</div>';
        return;
    }
    
    myDonations.forEach(item => {
        list.innerHTML += `
            <div class="card listing-card">
                <div class="listing-header">
                    <h4 class="listing-title">${item.foodName}</h4>
                    <span class="badge ${item.status==='reserved' ? 'reserved' : ''}">${item.status.replace('_', ' ')}</span>
                </div>
                <p class="listing-meta">Qty: ${item.quantity} ${item.unit} • ${item.category}</p>
                <div class="listing-actions">
                    <button class="btn-secondary" style="color: var(--primary-blue);" onclick="editDonation('${item._id}')">Edit</button>
                    <button class="btn-secondary btn-danger" style="color: #e53e3e;" onclick="deleteDonation('${item._id}')">🗑️ Remove</button>
                </div>
            </div>
        `;
    });
}

async function deleteDonation(id) {
    if(confirm("Permanently remove this donation entry?")) {
        await fetch(`${API_BASE}/donations/${id}`, { method: 'DELETE' });
        initProviderHistory();
    }
}


// === ANIMAL SHELTER FLOW ===

async function initShelterSearch() {
    const list = document.getElementById('shelterSearchList');
    list.innerHTML = '<div class="card text-center">Loading network...</div>';
    
    const searchInput = document.getElementById('searchShelterInput');
    let url = `${API_BASE}/donations/all?status=available`;
    if(searchInput && searchInput.value) {
        url += `&foodName=${encodeURIComponent(searchInput.value)}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    
    list.innerHTML = '';
    if(data.length === 0) list.innerHTML = '<div class="card text-center">No available food matches your search.</div>';
    
    data.forEach(item => {
        const provName = item.providerId?.name || 'Unknown Provider';
        list.innerHTML += `
            <div class="card listing-card">
                <div class="img-placeholder" style="font-size: 40px; margin-bottom: 12px; background: #fff5f5; border: 1px dashed #feb2b2; color: #e53e3e;">🍲</div>
                <div class="listing-header">
                    <h4 class="listing-title">${item.foodName}</h4>
                    <span class="badge">${item.category}</span>
                </div>
                <p class="listing-meta">Available Amount: ${item.quantity} ${item.unit}</p>
                <p class="listing-meta" style="margin-top:4px;">Provided By: ${provName}</p>
                <button class="btn-primary" style="margin-top:16px;" onclick="reserveDonation('${item._id}', '${item.providerId._id || item.providerId}')">Reserve This Food</button>
            </div>
        `;
    });
}

async function reserveDonation(donationId, providerId) {
    if(confirm("Confirm reservation for this surplus food?")) {
        const payload = {
            donationId,
            shelterId: localStorage.getItem('demoShelterId'),
            providerId,
            reservationStatus: 'confirmed'
        };
        await fetch(`${API_BASE}/reservations/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        await fetch(`${API_BASE}/donations/${donationId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({status: 'reserved'}) });
        
        alert("Reservation confirmed successfully! Pick up soon.");
        window.location.href = 'shelter-history.html';
    }
}

async function initShelterHistory() {
    const list = document.getElementById('shelterHistoryList');
    list.innerHTML = '<div class="card text-center">Loading network...</div>';
    
    const res = await fetch(`${API_BASE}/reservations/all`);
    const data = await res.json();
    
    const myId = localStorage.getItem('demoShelterId');
    const myRes = data.filter(r => (r.shelterId._id || r.shelterId) === myId);
    
    list.innerHTML = '';
    if(myRes.length === 0) list.innerHTML = '<div class="card text-center">No reservations found yet. Search for food to make one!</div>';
    
    myRes.forEach(item => {
        const dName = item.donationId?.foodName || 'Unknown Details';
        const dUnit = item.donationId?.unit || '';
        const dQty = item.donationId?.quantity || '';
        list.innerHTML += `
            <div class="card listing-card">
                 <div class="listing-header">
                    <h4 class="listing-title">${dName}</h4>
                    <span class="badge reserved" style="background:#d4edda; color:#155724;">${item.reservationStatus}</span>
                </div>
                <p class="listing-meta mt-24">Amount Reserved: ${dQty} ${dUnit}</p>
                <p class="listing-meta" style="font-size:12px;">Stored System ID: ${item._id.substring(0, 8)}...</p>
            </div>
        `;
    });
}

// === REPORTING METRICS ===
async function initReports() {
    const res = await fetch(`${API_BASE}/reports/summary`);
    const data = await res.json();
    
    document.getElementById('valProviders').textContent = data.totalProviders;
    document.getElementById('valShelters').textContent = data.totalShelters;
    document.getElementById('valDonations').textContent = data.totalDonations;
    document.getElementById('valQuantity').textContent = data.totalQuantity;

    const sList = document.getElementById('statusList');
    if(sList) {
        sList.innerHTML = '';
        data.donationByStatus.forEach((d, index) => {
            const isLast = index === data.donationByStatus.length - 1;
            sList.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding: 12px 0; ${isLast ? '' : 'border-bottom: 1px solid var(--border-color);'}">
                    <span style="font-weight:600; color:var(--text-dark); text-transform:capitalize;">${d._id || 'Unknown'}</span>
                    <span class="badge" style="background:var(--primary-blue); color:white;">${d.count}</span>
                </div>
            `;
        });
    }

    const cList = document.getElementById('categoryList');
    if(cList) {
        cList.innerHTML = '';
        data.donationByCategory.forEach((d, index) => {
            const isLast = index === data.donationByCategory.length - 1;
            cList.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding: 12px 0; ${isLast ? '' : 'border-bottom: 1px solid var(--border-color);'}">
                    <span style="font-weight:600; color:var(--text-dark);">${d._id || 'Unknown'}</span>
                    <span class="badge" style="background:var(--primary-blue); color:white;">${d.count}</span>
                </div>
            `;
        });
    }
}
