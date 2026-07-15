
const nxtBtn = document.getElementById('nextBtn');
const bckBtn = document.getElementById('backBtn');
const offSet = 120;
let activPage = 1;

let posibleGardians = [];
function updatePosibeGardians() {
    let newPosibleGardians = [];


    const curGardians = [...document.getElementsByClassName('guardian')];
    const companions = [...document.getElementsByClassName('name')];

    console.log(companions);

    companions.forEach((el) => {
        if (el.value != "")
            if (el.classList.contains("posibleGardian"))
                newPosibleGardians.push(el.value);
    });
    curGardians.forEach(el => {
        el.innerHTML = "";
        newPosibleGardians.forEach(element => {
            const newOpiton = document.createElement("option");
            newOpiton.value = element;
            newOpiton.innerHTML = element;
            el.appendChild(newOpiton);
        });
    });

}

const translateX = (element, x) => {
    element.style.transform = "translate(" + x + ", 0)";
    // element.style.left = "" + x;
}
bckBtn.addEventListener('click', () => {
    if (activPage - 1 >= 1) {
        activPage -= 1;
        nxtBtn.disabled = false;

    }
    const div = document.getElementById('page' + activPage);
    translateX(div, 0 + "%");
    div.style.opacity = '1';
    if (activPage - 1 < 1) {
        bckBtn.disabled = true;
    }
});

nxtBtn.addEventListener('click', () => {
    const div = document.getElementById('page' + activPage);
    translateX(div, -offSet + "%");
    div.style.opacity = '0';
    if (activPage + 1 <= 3) {
        activPage += 1;
        bckBtn.disabled = false;
    }
    if (activPage + 1 > 3) {
        nxtBtn.disabled = true
    }
});
const fieldDescriptions = {
    fullname: "Imię i nazwisko – minimum 3 znaki.",
    email: "Adres e-mail w poprawnym formacie (musi zawierać @ oraz końcówkę domeny).",
    email2: "Powtórzony e-mail musi być identyczny jak pierwszy.",
    checkin: "Data zameldowania nie może być pusta.",
    checkout: "Data wymeldowania musi być późniejsza niż data zameldowania.",
    country: "Kraj – minimum 2 znaki.",
    city: "Miasto – minimum 2 znaki.",
    zip: "Kod pocztowy w formacie XX-XXX.",
    street: "Ulica i numer domu/mieszkania – od 4 do 30 znaków.",
    cardNumber: "Numer karty w formacie XXXX-XXXX-XXXX-XXXX (16 cyfr).",
    exp: "Data ważności karty w formacie MM/RR (miesiąc 01–12).",
    cvv: "Kod CVV – dokładnie 3 cyfry."
};


const fields = {
    fullname: v => v.length > 2,
    email: v => /\S+@\S+\.\S+/.test(v),
    email2: v => v === document.getElementById("email").value,
    checkin: v => v.length > 0,
    checkout: v => v.length > 0 &&
        v > document.getElementById("checkin").value,
    country: v => v.length > 1,
    city: v => v.length > 1,
    zip: v => /^\d{2}-\d{3}$/.test(v),
    street: v => v.length > 3 && v.length <= 30,
    cardNumber: v => /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(v),
    exp: v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    cvv: v => /^\d{3}$/.test(v)
};

function addErrorMessage(fieldId, errorBox) {
    const message = fieldDescriptions[fieldId];

    // jeśli komunikat istnieje w opisach
    if (message) {
        const p = document.createElement("p");
        p.textContent = `• ${message}`;
        errorBox.appendChild(p);
    }
}

function validateForm() {
    const errorBox = document.getElementById("errorBox");
    errorBox.innerHTML = ""; // czyścimy poprzednie błędy

    let valid = true;

    Object.keys(fields).forEach(fieldId => {
        const value = document.getElementById(fieldId).value.trim();
        const isValid = fields[fieldId](value);

        if (!isValid) {
            valid = false;
            addErrorMessage(fieldId, errorBox);
        }
    });

    if (!valid) {
        errorBox.classList.remove("hidden");
    } else {
        errorBox.classList.add("hidden");
    }

    return valid;
}


// walidacja przy utracie focusa
Object.keys(fields).forEach(id => {
    document.getElementById(id).addEventListener("blur", () => validateField(id));
});

// // wysyłanie formularza
document.getElementById("reservationForm").addEventListener("submit", e => {
    e.preventDefault();

    if (validateForm()) {
        alert("Formularz poprawny — wysłano!");
    }
});



const tableBody = document.getElementById("personTable");
const rowCount = document.getElementById("rowCount");

document.getElementById("addRowBtn").addEventListener("click", addRow);

function addRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td><input type="text" class="name"></td>

        <td>
            <select class="age">
                <option value="">-- wybierz --</option>
                <option value="adult">Dorosły</option>
                <option value="child">Dziecko</option>
            </select>
        </td>

        <td>
            <select class="guardian" disabled>

            </select>
        </td>

        <td>
            <button class="up"> <span class="button_top">^</span></button>
        </td>
        <td>
            <button class="down"> <span class="button_top">v</span></button>
        </td>
        <td>
            <button class="delete"> <span class="button_top">X</span></button>
        </td>
    `;

    tableBody.appendChild(tr);
    updateRowCount();
    addRowListeners(tr);
}



function addRowListeners(tr) {
    const ageSelect = tr.getElementsByClassName("age")[0];
    const guardianInput = tr.getElementsByClassName("guardian")[0];

    ageSelect.addEventListener("change", () => {
        const nameFiller = tr.getElementsByClassName("name")[0];
        if (ageSelect.value === "child") {
            guardianInput.disabled = false;
            nameFiller.removeEventListener("change", updatePosibeGardians);
            if (nameFiller.classList.contains("posibleGardian")) nameFiller.classList.remove("posibleGardian");

            // if (!guardianInput.classList.contains("guardian")) guardianInput.classList.add("guardian");
        } else {

            nameFiller.addEventListener("change", updatePosibeGardians);
            if (!nameFiller.classList.contains("posibleGardian")) nameFiller.classList.add("posibleGardian");

            guardianInput.disabled = true;
            // if (guardianInput.classList.contains("guardian")) guardianInput.classList.remove("guardian");
            guardianInput.value = "";
        }
        updatePosibeGardians();
    });



    tr.getElementsByClassName("delete")[0].addEventListener("click", () => {
        tr.remove();
        updateRowCount();
    });

    tr.getElementsByClassName("up")[0].addEventListener("click", () => {
        if (tr.previousElementSibling) {
            tableBody.insertBefore(tr, tr.previousElementSibling);
        }
    });

    tr.getElementsByClassName("down")[0].addEventListener("click", () => {
        if (tr.nextElementSibling) {
            tableBody.insertBefore(tr.nextElementSibling, tr);
        }
    });
}

function updateRowCount() {
    rowCount.textContent = tableBody.children.length - 2;
    updatePosibeGardians();
}

function autofillForm() {

    document.getElementById("fullname").value = "Jan Kowalski";
    document.getElementById("email").value = "jan.kowalski@example.com";
    document.getElementById("email2").value = "jan.kowalski@example.com";
    document.getElementById("checkin").value = "2025-06-10";
    document.getElementById("checkout").value = "2025-06-15";

    document.getElementById("country").value = "Polska";
    document.getElementById("city").value = "Warszawa";
    document.getElementById("zip").value = "00-001";
    document.getElementById("street").value = "Słoneczna 5/12";

    document.getElementById("cardNumber").value = "1234-5678-9012-3456";
    document.getElementById("exp").value = "07/27";
    document.getElementById("cvv").value = "123";

    console.log("Formularz automatycznie uzupełniony.");
}

document.addEventListener("keydown", function (e) {
    // tylko lewy lub prawy CTRL
    if (e.code === "ControlLeft") {
        autofillForm();
    }
});
