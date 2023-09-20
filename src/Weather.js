const apiKey = '30e3d1a9c51d4f939bf200856231909';
export let currLocation = 'Los Angeles';

export async function getWeatherForLocation(location) {
    try {
        // Fetch from the api
        return await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`, {mode: 'cors'})
            .then(response => { // Check the response
                if (!response.ok) {
                    throw new Error(`Weather Fetch failed for ${location}`);
                } else {
                    currLocation = location; // Update the current location
                    return parseJson(response); // Parse the json and return the promise
                }
            })
            .then(response => {
                return response; // Return the parsed json
            })
            .catch(err => { // If error occurs
                console.error(`Error: ${err.message}`);

                return undefined;
            });
    } catch (e) { // If error occurs
        console.error(`Error: ${e.message}`);

        return undefined;
    }
}

function parseJson(response) {
    // Parse the json to get the proper data
    return response.json()
        .then(data => {
            return {
                city: data['location']['name'],
                region: data['location']['region'],
                country: data['location']['country'],
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
                nextDays: getNextThreeDays(data),
                todayHourly: getTodayHourly(data)
            };
        });
}

function getNextThreeDays(json) {
    // Parse the json to get the data
    let nextDaysList = [];
    for (const day of json['forecast']['forecastday']) {
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

    // Removes the first element which is the current day
    nextDaysList.shift();

    return nextDaysList;
}

function getTodayHourly(data) {
    // Gets the current hour from data.location.localtime
    const currentHour = (data.location["localtime"]).split(' ')[1].split(':')[0];

    // Parse the json to get the hourly data
    let todayHourly = [];
    for (const hour of data['forecast']['forecastday'][0]['hour']) {
        todayHourly.push({
            hour: hour['time'].split(' ')[1].split(':')[0],
            tempC: hour['temp_c'],
            tempF: hour['temp_f'],
            condition: hour['condition']['text'],
            iconURL: hour['condition']['icon'],
            chanceOfRain: hour['chance_of_rain']
        });
    }

    // Removes all hours except for the current hour and forward
    todayHourly.splice(0, parseInt(currentHour));

    return todayHourly;
}
