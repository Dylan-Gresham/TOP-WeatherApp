let currLocation, getWeatherForLocation;
({
    currLocation,
    getWeatherForLocation
} = require("./Weather.js"));

export function createNewWeatherIcon() {
    const icon = document.createElement('img');
    icon.classList.add('weatherIcon');

    return icon;
}

export async function initialize() {
    // Get the current weather for Los Angeles
    const currWeather = await getWeatherForLocation(currLocation);
    if (currWeather === undefined) {
        console.log('JSON Fetch failed');
        console.log(currWeather);
        return;
    } else {
        console.log('JSON Fetch Success!');
        console.log(currWeather);
    }

    // Create main container
    const container = document.createElement('div');
    container.id = 'container';

    // Create div for today's weather
    const todaysSection = document.createElement('div');
    todaysSection.id = 'todaysSection';
    await createCurrentWeatherDiv(todaysSection, currWeather);
    console.log("Created current weather div");

    // Create div for forecast info (next days/hourly)
    const forecastSection = document.createElement('div');
    forecastSection.id = 'forecastSection';
    await swapToDaily(forecastSection, currWeather);
    console.log("Swapped to daily forecast");

    // Add everything to the container
    container.append(todaysSection, forecastSection);

    return container;
}

async function createCurrentWeatherDiv(container, jsonObj) {
    emptyElement(container);

    const leftDiv = document.createElement('div');
    leftDiv.id = 'leftDiv';
    const infoDiv = document.createElement('div');
    infoDiv.id = 'infoDiv';
    const currentCondition = document.createElement('h2');
    currentCondition.id = 'currentCondition';
    currentCondition.textContent = jsonObj.condition;
    const currentLocation = document.createElement('h6');
    currentLocation.id = 'currentLocation';
    currentLocation.textContent = currLocation;
    const currentTemp = document.createElement('h1');
    currentTemp.id = 'currentTemp';
    currentTemp.textContent = `${jsonObj.tempF} \xB0F`;
    const switchUnitsButton = document.createElement('button');
    switchUnitsButton.id = 'switchUnitsButton';
    switchUnitsButton.textContent = 'Switch to \xB0C';
    switchUnitsButton.addEventListener('click', (event) => {
        if (switchUnitsButton.classList.contains('switched')) {
            currentTemp.textContent = `${jsonObj.tempF} \xB0F`;
            switchUnitsButton.textContent = 'Switch to \xB0C';
            switchUnitsButton.classList.toggle('switched');
        } else {
            currentTemp.textContent = `${jsonObj.tempC} \xB0C`;
            switchUnitsButton.textContent = 'Switch to \xB0F';
            switchUnitsButton.classList.toggle('switched');
        }

        event.stopPropagation();
    });
    infoDiv.append(currentCondition, currentLocation, currentTemp, switchUnitsButton);

    const changeLocationsInput = document.createElement('input');
    changeLocationsInput.id = 'changeLocationsInput';
    changeLocationsInput.setAttribute('type', 'search');
    changeLocationsInput.setAttribute('placeholder', 'New city...');
    changeLocationsInput.addEventListener('keypress', async (event) => {
        if (event.code === 'Enter') {
            if (!(changeLocationsInput.value === '' || changeLocationsInput.value === undefined
                || changeLocationsInput.value === null)) {
                const newJsonObj = getWeatherForLocation();
                await createCurrentWeatherDiv(container, newJsonObj);
            }
        }
    });
    leftDiv.append(infoDiv, changeLocationsInput);

    container.appendChild(leftDiv);
}

async function swapToDaily(container, jsonObj) {
    emptyElement(container);

    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'buttonDiv';
    const forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecastDiv';

    const dailyButton = document.createElement('button');
    dailyButton.id = 'dailyButton';
    dailyButton.textContent = 'Daily';
    dailyButton.addEventListener('click', async (event) => {
        if (!dailyButton.classList.contains('switched')) {
            await swapToDaily(container, jsonObj);
            dailyButton.classList.toggle('switched');
            hourlyButton.classList.toggle('switched');
        }

        event.stopPropagation();
    });
    const hourlyButton = document.createElement('button');
    hourlyButton.id = 'hourlyButton';
    hourlyButton.textContent = 'Hourly';
    hourlyButton.addEventListener('click', async (event) => {
        if (!hourlyButton.classList.contains('switched')) {
            await swapToHourly(container, jsonObj);
            hourlyButton.classList.toggle('switched');
            dailyButton.classList.toggle('switched');
        }

        event.stopPropagation();
    });
    buttonDiv.append(dailyButton, hourlyButton);

    const nextDayCard = document.createElement('div');
    nextDayCard.classList.add('dayCard');
    const nextDayDate = document.createElement('p');
    nextDayDate.classList.add('dayDate');
    nextDayDate.textContent = jsonObj.nextDays[0].date;
    const nextDayIcon = document.createElement('img');
    nextDayIcon.classList.add('dayIcon');
    nextDayIcon.src = jsonObj.nextDays[0].iconURL;
    const nextDayTemps = document.createElement('p');
    nextDayTemps.classList.add('dayTemps');
    nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].maxDegF} \xB0F`;
    nextDayTemps.addEventListener('click', (event) => {
        if (!nextDayTemps.classList.contains('clicked')) {
            nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegC} \xB0C | ${jsonObj.nextDays[0].maxDegC} \xB0C`;
            nextDayTemps.classList.toggle('clicked');
        } else {
            nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].maxDegF} \xB0F`;
            nextDayTemps.classList.toggle('clicked');
        }

        event.stopPropagation();
    });
    nextDayCard.append(nextDayDate, nextDayIcon, nextDayTemps);

    const thirdDayCard = document.createElement('div');
    thirdDayCard.classList.add('dayCard');
    const thirdDayDate = document.createElement('p');
    thirdDayDate.classList.add('dayDate');
    thirdDayDate.textContent = jsonObj.nextDays[1].date;
    const thirdDayIcon = document.createElement('img');
    thirdDayIcon.classList.add('dayIcon');
    thirdDayIcon.src = jsonObj.nextDays[1].iconURL;
    const thirdDayTemps = document.createElement('p');
    thirdDayTemps.classList.add('dayTemps');
    thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].maxDegF} \xB0F`;
    thirdDayTemps.addEventListener('click', (event) => {
        if (!thirdDayTemps.classList.contains('clicked')) {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegC} \xB0C | ${jsonObj.nextDays[1].maxDegC} \xB0C`;
            thirdDayTemps.classList.toggle('clicked');
        } else {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].maxDegF} \xB0F`;
            thirdDayTemps.classList.toggle('clicked');
        }

        event.stopPropagation();
    });
    thirdDayCard.append(thirdDayDate, thirdDayIcon, thirdDayTemps);
    forecastDiv.append(nextDayCard, thirdDayCard);

    container.append(buttonDiv, forecastDiv);
}

async function swapToHourly(container, jsonObj) {
    emptyElement(container);


}

function emptyElement(element) {
    while (element.childList.firstChild) {
        element.removeChild(element.children[0]);
    }
}
