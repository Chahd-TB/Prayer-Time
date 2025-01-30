// Configurations
var config = {
    countriesUrl: "https://api.countrystatecity.in/v1/countries",
    citiesUrl: "https://api.countrystatecity.in/v1/countries/[ciso]/cities",
    apiKey: "ZU1UcWJvWkdndWN2NXQ5SXlFcTlZMVdiSExiZzZNMm1MeURuRFQ2ZA=="
};

// Utility function for home.html
function loadCountries() {
    fetch(config.countriesUrl, { headers: { "X-CSCAPI-KEY": config.apiKey } })
        .then(response => response.json())
        .then(data => {
            var countrySelect = document.getElementById("country");
            countrySelect.innerHTML = "<option value='' disabled selected>اختر بلادك</option>";
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
            var citySelect = document.getElementById("city");
            citySelect.innerHTML = "<option value='' disabled selected>اختر ولايتك</option>";
            data.forEach(city => {
                citySelect.innerHTML += `<option value="${city.name}">${city.name}</option>`;
            });
        })
        .catch(error => {
            console.error('Error loading cities:', error);
        });
}

// Function for prayer.html
function adan(country, city) {
    axios.get(`http://api.aladhan.com/v1/timingsByCity?country=${country}&city=${city}`)
        .then(function(response) {
            document.getElementById("fadjer").innerHTML = response.data.data.timings.Fajr;
            document.getElementById("sunrise").innerHTML = response.data.data.timings.Sunrise;
            document.getElementById("duhur").innerHTML = response.data.data.timings.Dhuhr;
            document.getElementById("asar").innerHTML = response.data.data.timings.Asr;
            document.getElementById("magrib").innerHTML = response.data.data.timings.Maghrib;
            document.getElementById("isha").innerHTML = response.data.data.timings.Isha;
            document.querySelector("span").innerHTML = response.data.data.date.readable;
        })
        .catch(function(error) {
            console.error('Error fetching prayer times:', error);
        });
}

// loaded  home and prayer

window.onload = function() {
    if (document.getElementById("country")) {
        // This for home.html
        loadCountries();
        var countrySelect = document.getElementById("country");
        var citySelect = document.getElementById("city");

        countrySelect.addEventListener('change', function() {
            const selectedCountry = countrySelect.value;
            if (selectedCountry) {
                loadCities(selectedCountry);
                citySelect.addEventListener('change', function() {
                    const selectedCity = citySelect.value;
                    if (selectedCity) {
                       // قمت بتخرين قيمة البلد و المدينة لاستعمالها في اظهار توقيت الصلاة في prayer
                        localStorage.setItem('selectedCountry', selectedCountry);
                        localStorage.setItem('selectedCity', selectedCity);
                    }
                });
            } else {
                citySelect.innerHTML = "<option value='' disabled selected>اختر ولايتك</option>";
            }
        });
    } else if (document.getElementById("fadjer")) {
         // استرجاع البلد والمدينة المحددين من التخزين المحليجلب البلد و المدينة المخرنة و استدعاء الدالة adan
        const country = localStorage.getItem('selectedCountry');
        const city = localStorage.getItem('selectedCity');
        if (country && city) {
            adan(country, city);
        }
    }
};
