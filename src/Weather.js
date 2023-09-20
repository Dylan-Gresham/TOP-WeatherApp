const apiKey = '30e3d1a9c51d4f939bf200856231909';
export let currLocation = 'Los Angeles';
export async function getWeatherForLocation(location) {
    try {
        // Fetch from the api
        return await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`, {mode: 'cors'})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Weather Fetch failed for ${location}`);
                } else {
                    currLocation = location; // Update the current location
                    return parseJson(response);
                }
            })
            .then(response => {
                return response;
            })
            .catch(err => {
                console.error(`Error: ${err.message}`);
            });
    } catch (e) {
        console.error(`Error: ${e.message}`);

        return undefined;
    }
}

function parseJson(response) {
    return response.json()
        .then(data => {
            return {
                icon: data['current']['condition']['icon'],
                tempC: data['current']['temp_c'],
                tempF: data['current']['temp_f'],
                windM: data['current']['wind_mph'],
                windK: data['current']['wind_kph'],
                windDir: data['current']['wind_dir'],
                humidity: data['current']['humidity'],
                condition: data['current']['condition']['text'],
                feelsLikeC: data['current']['feelslike_c'],
                feelsLikeF: data['current']['feelslike_f'],
                chanceOfRain: data['forecast']['forecastday'][0]['day']['daily_chance_of_rain'],
                nextDays: getNextThreeDays(data)
            };
        });
}

function getNextThreeDays(json) {
    let nextDaysList = [];
    for(const day of json['forecast']['forecastday']) {
        nextDaysList.push({
            date: day['date'],
            iconURL: day['day']['condition']['icon'],
            maxDegC: day['day']['maxtemp_c'],
            maxDegF: day['day']['maxtemp_f'],
            minTempC: day['day']['mintemp_c'],
            minTempF: day['day']['mintemp_f'],
            avgTempC: day['day']['avgtemp_c'],
            avgTempF: day['day']['avgtemp_f']
        });
    }
    nextDaysList.shift(); // Removes the first element which is the current day

    return nextDaysList;
}
