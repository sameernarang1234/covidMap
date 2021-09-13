let cases = {};
let coordinates = {};

const newCases = document.getElementById("new-cases");
const recovered = document.getElementById("recovered");
const deaths = document.getElementById("deaths");

newCases.addEventListener("click", () => updateMap("deltaconfirmed"));
recovered.addEventListener("click", () => updateMap("deltarecovered"));
deaths.addEventListener("click", () => updateMap("deltadeaths"));

function updateMap(covidDataType) {

    fetch("https://corona-virus-world-and-india-data.p.rapidapi.com/api_india", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
            "x-rapidapi-key": "3c3435447cmsh6a2d040285ccba9p1425fdjsnfdf6aecff286"
        }
    })
    .then(response => response.json())
    .then(data => {
        cases = data.state_wise;
        console.log(cases);
        let maxCases = 0;
        for (let key in cases) {
            let state = cases[key];
            if (state["deltaconfirmed"] > maxCases) {
                maxCases = state[covidDataType];
            }
        }
        fetch("/js/state_coordinates.json")
        .then(response => response.json())
        .then(rsp => {
            for (let element in rsp) {
                
                let state = rsp[element];
                let state_cases = cases[element];

                let lattitude = state["lattitude"];
                let longitude = state["longitude"];

                let hue = Math.floor((state_cases[covidDataType] / maxCases) * 255);

                if (covidDataType === "deltarecovered") {
                    color = `rgb(0, ${hue}, 0)`;
                }
                else {
                    color = `rgb(${hue}, 0, 0)`;
                }

                new mapboxgl.Marker({
                    draggable: false,
                    color: color
                })
                .setLngLat([longitude, lattitude])
                .addTo(map);
            }
        })
    });
}

updateMap("deltaconfirmed");