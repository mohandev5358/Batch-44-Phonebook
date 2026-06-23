const STORAGE_KEY = 'contacts';

function loadContacts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function getContacts() {
    displayContacts(loadContacts());
}

function displayContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.className = 'contact-item';

        const meta = document.createElement('div');
        meta.className = 'contact-meta';

        const name = document.createElement('div');
        name.className = 'contact-name';
        name.textContent = contact.name;
        meta.appendChild(name);

        const phone = document.createElement('div');
        phone.className = 'contact-phone';
        phone.textContent = contact.phone;
        meta.appendChild(phone);

        li.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteContact(contact.id));
        actions.appendChild(delBtn);

        const updBtn = document.createElement('button');
        updBtn.textContent = 'Update';
        updBtn.addEventListener('click', () => updateContact(contact.id));
        actions.appendChild(updBtn);

        li.appendChild(actions);
        contactList.appendChild(li);
    });
}

function showFormError(message) {
    const err = document.getElementById('formError');
    if (!err) return;
    if (!message) {
        err.style.display = 'none';
        err.textContent = '';
        return;
    }
    err.style.display = 'block';
    err.textContent = message;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
}

function addContact() {
    showFormError('');

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !phone || !email) {
        showFormError('All fields are required.');
        return;
    }

    if (!validatePhone(phone)) {
        showFormError('Enter a valid phone number (at least 10 digits).');
        return;
    }

    if (!validateEmail(email)) {
        showFormError('Enter a valid email address.');
        return;
    }

    const contacts = loadContacts();
    const newContact = { id: Date.now(), name, phone, email };
    contacts.push(newContact);
    saveContacts(contacts);

    nameInput.value = phoneInput.value = emailInput.value = '';
    getContacts();
}

function deleteContact(id) {
    const contacts = loadContacts().filter(c => c.id !== id);
    saveContacts(contacts);
    getContacts();
}

function updateContact(id) {
    const contacts = loadContacts();
    const idx = contacts.findIndex(c => c.id === id);
    if (idx === -1) return;

    const contact = contacts[idx];
    const newName = prompt('Enter new name', contact.name);
    if (newName === null) return;
    const newPhone = prompt('Enter new phone', contact.phone);
    if (newPhone === null) return;
    const newEmail = prompt('Enter new email', contact.email);
    if (newEmail === null) return;

    if (!newName.trim() || !validatePhone(newPhone) || !validateEmail(newEmail)) {
        alert('Invalid input. Update cancelled.');
        return;
    }

    contacts[idx] = { ...contact, name: newName.trim(), phone: newPhone.trim(), email: newEmail.trim() };
    saveContacts(contacts);
    getContacts();
}

function clearAll() {
    if (!confirm('Clear all contacts? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    getContacts();
}

function searchContact() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filtered = loadContacts().filter(c => c.name.toLowerCase().includes(searchValue));
    displayContacts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    getContacts();
});