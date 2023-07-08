import './assets/main.scss'

const input = {
    'api': 'https://api.open-meteo.com/v1/forecast',
    "timezone": "Europe/Riga",
    "city": {
        "country": "Latvia",
        "name": "Riga",
        "lat": 56.95,
        "lon": 24.1,
    },
    'weather_codes': {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light, moderate, and dense intensity',
        53: 'Drizzle: Light, moderate, and dense intensity',
        55: 'Drizzle: Light, moderate, and dense intensity',
        56: 'Freezing Drizzle: Light and dense intensity',
        57: 'Freezing Drizzle: Light and dense intensity',
        61: 'Rain: Slight, moderate and heavy intensity',
        63: 'Rain: Slight, moderate and heavy intensity',
        65: 'Rain: Slight, moderate and heavy intensity',
        66: 'Freezing Rain: Light and heavy intensity',
        67: 'Freezing Rain: Light and heavy intensity',
        71: 'Snow fall: Slight, moderate, and heavy intensity',
        73: 'Snow fall: Slight, moderate, and heavy intensity',
        75: 'Snow fall: Slight, moderate, and heavy intensity',
        77: 'Snow grains',
        80: 'Rain showers: Slight, moderate, and violent',
        81: 'Rain showers: Slight, moderate, and violent',
        82: 'Rain showers: Slight, moderate, and violent',
        85: 'Snow showers slight and heavy',
        86: 'Snow showers slight and heavy',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    }
};

const wardoco_load = async function (lat, lon, timezone = input.timezone, current = true, url = input.api) {
    url = url + `?latitude=${lat}&longitude=${lon}`
        + `&current_weather=` + (current ? 'true' : 'false')
        + `&daily=weathercode&timezone=${timezone}`
        + `&forecast_days=1`

    let json = null;
    // Create the GET request
    await fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Failed fetching data!');
        }

        return response.json();
    }).then(data => {
        json = data;
    }).catch(error => {
        console.error(error);
    });

    return json;
}

function wardoco_now() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let date = today.getDate();
    date = date < 10 ? '0' + date : date;

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

(async function (input, wardoco_load, wardoco_now) {
    try {
        const wrapper = document.querySelector('#app-wardoco');

        if (typeof input !== 'object') {
            throw new Error('Input data is not an object!');
        }

        if (input.api === undefined) {
            throw new Error('Not found api in input data!');
        }

        if (input.city === undefined) {
            throw new Error('Not found city in input data!');
        }

        if (input.timezone === undefined) {
            input.timezone = 'GMT';
        }

        const data = input.city;
        if (data.country === undefined || data.name === undefined || data.lat === undefined || data.lon === undefined) {
            throw new Error('Not found city country, name, lat or lon in input data!');
        }

        const json = await wardoco_load(data.lat, data.lon, input.timezone);
        if (json === null) {
            throw new Error('Failed to load data!');
        }

        if (json.current_weather === undefined) {
            throw new Error('Not found current_weather in response data!');
        }

        if (json.current_weather.temperature === undefined) {
            throw new Error('Not found temperature in current_weather!');
        }

        if (json.daily === undefined) {
            throw new Error('Not found daily in response data!');
        }

        if (json.daily.weathercode === undefined) {
            throw new Error('Not found weathercode in daily!');
        }

        let description = '';
        if (input.weather_codes !== undefined) {
            const currentWeatherCodes = json.daily.weathercode;
            for (const key in currentWeatherCodes) {
                if (!currentWeatherCodes.hasOwnProperty(key)) {
                    continue;
                }

                const code = currentWeatherCodes[key];

                if (!code in input.weather_codes) {
                    continue;
                }

                if (description === '') {
                    description = input.weather_codes[code];
                    continue;
                }

                description = description + ', ' + input.weather_codes[code];
            }
        }

        wrapper.querySelector('.location').innerHTML = `${data.name}, ${data.country}`;
        wrapper.querySelector('.temperature').innerHTML = `${json.current_weather.temperature}°C`;
        wrapper.querySelector('.description').innerHTML = description;
        wrapper.querySelector('.time').innerHTML = wardoco_now();
    } catch (error) {
        console.log(error);
        console.info('Contact with author: wadoco@icloud.com');
    }
})(input, wardoco_load, wardoco_now);