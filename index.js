var config = {
    countriesUrl: "https://api.countrystatecity.in/v1/countries",
    citiesUrl: "https://api.countrystatecity.in/v1/countries/[ciso]/cities",
    apiKey: "ZU1UcWJvWkdndWN2NXQ5SXlFcTlZMVdiSExiZzZNMm1MeURuRFQ2ZA=="
};

var countrySelect = document.getElementById("country");
var citySelect = document.getElementById("city");

function loadCountries() {
    fetch(config.countriesUrl, { headers: { "X-CSCAPI-KEY": config.apiKey } })
        .then(response => response.json())
        .then(data => {
            countrySelect.innerHTML = ""; 
            countrySelect.innerHTML = "اختر مدينتك"; 
            data.forEach(country => {
                countrySelect.innerHTML += `<option value="${country.iso2}">${country.name}</option>`;
            });
        })
        .catch(error => {
            console.error('Error loading countries:', error);
        });
}

function loadCities(countryCode) {
    const url = config.citiesUrl.replace("[ciso]", countryCode);
    fetch(url, { headers: { "X-CSCAPI-KEY": config.apiKey } })
        .then(response => response.json())
        .then(data => {
            citySelect.innerHTML = ""; 
            citySelect.innerHTML = "اختر ولايتك"
            data.forEach(city => {
                citySelect.innerHTML += `<option value="${city.name}">${city.name}</option>`;
            });

        })
        .catch(error => {
            console.error('Error loading cities:', error);
        });
}


window.onload = loadCountries;


countrySelect.addEventListener('change', function() {
    const selectedCountry = countrySelect.value;
    if (selectedCountry) {
        loadCities(selectedCountry);
        citySelect.addEventListener('change', function(){
            const selectedCity = citySelect.value;
            adan(selectedCountry,selectedCity)
        } )
        
    } else {
        citySelect.innerHTML = ""; 
    }
});

function adan(country,city){

    axios.get(`http://api.aladhan.com/v1/timingsByCity?country=${country} &city=${city}`)
    .then(function (response) {
        document.getElementById("fadjer").innerHTML = response.data.data.timings.Fajr
        document.getElementById("sunrise").innerHTML = response.data.data.timings.Sunrise
        document.getElementById("duhur").innerHTML = response.data.data.timings.Dhuhr
        document.getElementById("asar").innerHTML = response.data.data.timings.Asr
        document.getElementById("magrib").innerHTML = response.data.data.timings.Maghrib
        document.getElementById("isha").innerHTML = response.data.data.timings.Isha
        
        document.getElementsByTagName("span")[0].innerHTML = response.data.data.date.readable
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });

}