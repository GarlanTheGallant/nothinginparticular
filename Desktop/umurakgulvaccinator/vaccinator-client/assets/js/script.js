"use strict";

document.addEventListener("DOMContentLoaded", init);

function init(){
    fillVaxOptions();
    showStats();
    document.querySelector("form").addEventListener("submit", processBookingForm);
}

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

function showStats(){
    const $statholder = document.querySelector("#stat");
    const actualStats = fetch("https://fredericvlummens.be/howest/covid.php")
    .then(response => response.json())
    .then(json => {
        const entries2021 = json.data.filter(stat => stat.date >= "2021-01-01");
        const caseAverages = entries2021.map(stat => stat.casesDaily);
        console.log(caseAverages);
        const yearAverage = caseAverages.reduce((acc, val) => acc + val, 0) / caseAverages.length;
        $statholder.innerHTML = `Average cases per day in 2021: <b> ${parseInt(yearAverage)} </b>`;
    })
    .catch(err => console.error(err));
    
}

function fillVaxOptions(){

    const $vaccineSelector = document.querySelector("#vaxtype");

    fetchFromServer("http://localhost/api/vaccine", "GET")
    .then(json => json.data.forEach(vaccine => {
        $vaccineSelector.insertAdjacentHTML("beforeend",`<option value="${vaccine.id}">${vaccine.name}</option>`);   
    }))
    .catch(err => console.error(err));

    
}

function buildFormFromData(){
    return {
        patientname: document.querySelector("#fullname").value,
        vaccine: document.querySelector("#vaxtype").value,
        date: document.querySelector("#date").value,
        allergies: document.querySelector("#allergies").value
    };
}

function processBookingForm(e){
    e.preventDefault();

    const form = buildFormFromData();

    fetchFromServer("http://localhost/api/createbooking", "POST", form)
    .catch(err => {
        if("errors" in err){
            console.log("buraya gel");
            displayErrors(err.errors);
        }
        else{
            console.log("sen niye buradasın birader");
            console.error(err);
        }
    });
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