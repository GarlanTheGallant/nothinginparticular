"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("form").addEventListener("submit", processForm);
    initVaccines();
    getAverageCases();
}

function processForm(e) {
    e.preventDefault();

    const booking = buildBooking();

    fetchFromServer("http://localhost/api/booking", "POST", booking)
        .then(data => {
            console.log(data);
            //displayThankYou();
        })
        .catch(err => {
            if ("errors" in err) {
                displayErrors(err.errors);
            } else {
                console.error(err);
            }
        });
}

function initVaccines() {
    const $select = document.querySelector("#vaxtype");

    fetchFromServer("http://localhost/api/vaccine", "GET")
        .then(json => {
            const data = json.data;

            data.forEach(vaccine => {
                const option = `<option value="${vaccine.id}">${vaccine.name}</option>`;
                $select.innerHTML += option;
            })
        })
}

function buildBooking() {
    return {
        patientname: document.querySelector("#fullname").value,
        vaccine: document.querySelector("#vaxtype").value,
        date: document.querySelector("#date").value,
        allergies: document.querySelector("#allergies").value
    };
}

function displayErrors(errors) {
    const $ul = document.querySelector("#errors");

    for (const field in errors) {
        for (const error of errors[field]) {
            const li = `<li>${error}</li>`;
            $ul.innerHTML += li;
        }
    };
}

/*function displayThankYou() {
    const $main = document.querySelector("main");
    $main.innerHTML = `<h2>Thank you!</h2>
                       <p>Your booking has been added.</p>
                       <a href='index.html'>Add another booking</a>`;
}*/

function fetchFromServer(url, method, body) {
    const options = buildOptions(method, body);

    return fetch(url, options)
        .then(res => res.json())
        .then(json => {
            if ("errors" in json) {
                throw json;
            } else {
                return json;
            }
        });
}

function buildOptions(method, body) {
    const options = {};

    options.method = method;
    options.headers = {
        "Content-Type": "application/json"
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return options;
}

function getAverageCases() {

    fetch("https://fredericvlummens.be/howest/covid.php")
        .then(res => res.json())
        .then(json => {

            const data = json.data.filter(elem => elem.date.startsWith("2021"))
                                  .map(elem => elem.casesDaily);
            const avg = data.reduce((acc, val) => acc + val, 0) / data.length;

            document.querySelector("#stat").innerHTML = `Average cases per day in 2021: <b> ${parseInt(avg)} </b>`;
        });

}
