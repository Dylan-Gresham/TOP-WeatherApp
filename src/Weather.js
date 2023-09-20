import {createNewWeatherIcon} from "./DomFuncs";

const apiKey = '30e3d1a9c51d4f939bf200856231909';
export let currLocation = 'Los Angeles';
export async function getWeatherForLocation(location) {
    try {
        // Fetch from the api
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`);
        if(!response.ok) {
            throw new Error(`Weather Fetch failed for ${location}`);
        }
        currLocation = location; // Update the current location

        return parseJson(response); // Return the json
    } catch (e) {
        console.error(`Error: ${e.message}`);

        return undefined;
    }
}

function parseJson(response) {
    const json = response.json();

    return {
        icon: json['current']['condition']['icon'],
        tempC: json['current']['temp_c'],
        tempF: json['current']['temp_f'],
        windM: json['current']['wind_mph'],
        windK: json['current']['wind_kph'],
        windDir: json['current']['wind_dir'],
        humidity: json['current']['humidity'],
        condition: json['current']['condition']['text'],
        feelsLikeC: json['current']['feelslike_c'],
        feelsLikeF: json['current']['feelslike_f'],
        chanceOfRain: json['forecast']['forecastday'][0]['daily_chance_of_rain'],
        nextDays: getNextThreeDays(json)
    };
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
