const API_URL = "http://localhost:3000/contacts";

async function getContacts() {

    try {

        const response = await fetch(API_URL);
        const contacts = await response.json();

        displayContacts(contacts);

    } catch (error) {
        alert("Error fetching contacts");
    }
}

function displayContacts(contacts) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";

  contacts.forEach(contact => {
    const li = document.createElement("li");

    const name = document.createElement("b");
    name.textContent = contact.name;
    li.appendChild(name);
    li.appendChild(document.createElement("br"));

    li.appendChild(document.createTextNode(contact.phone));
    li.appendChild(document.createElement("br"));

    li.appendChild(document.createTextNode(contact.email));
    li.appendChild(document.createElement("br"));
    li.appendChild(document.createElement("br"));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteContact(contact.id));
    li.appendChild(delBtn);

    const updBtn = document.createElement("button");
    updBtn.textContent = "Update";
    updBtn.addEventListener("click", () => updateContact(contact.id));
    li.appendChild(updBtn);

    contactList.appendChild(li);
  });
}

async function addContact() {

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (name === "" || phone === "" || email === "") {
        alert("All fields required");
        return;
    }

    if (phone.length < 10) {
        alert("Invalid phone number");
        return;
    }

    const newContact = {
        name,
        phone,
        email
    };

    try {

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newContact)
        });

        getContacts();

    } catch (error) {
        alert("Error adding contact");
    }
}

async function deleteContact(id) {

    try {

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        getContacts();

    } catch (error) {
        alert("Error deleting contact");
    }
}

async function updateContact(id) {

    const newName = prompt("Enter new name");
    const newPhone = prompt("Enter new phone");
    const newEmail = prompt("Enter new email");

    const updatedContact = {
        name: newName,
        phone: newPhone,
        email: newEmail
    };

    try {

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedContact)
        });

        getContacts();

    } catch (error) {
        alert("Error updating contact");
    }
}

async function searchContact() {

    const searchValue =
        document.getElementById("search").value.toLowerCase();

    const response = await fetch(API_URL);
    const contacts = await response.json();

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue)
    );

    displayContacts(filteredContacts);
}

getContacts();