import {
    currLocation,
    getWeatherForLocation
} from "./Weather";

export function createNewWeatherIcon() {
    const icon = document.createElement('img');
    icon.classList.add('weatherIcon');

    return icon;
}

export function initialize() {
    // Get the current weather for Los Angeles
    const currWeather = getWeatherForLocation(currLocation);

    // Create main container
    const container = document.createElement('div');
    container.id = 'container';

    // Create div for today's weather
    const todaysSection = document.createElement('div');
    todaysSection.id = 'todaysSection';
    createCurrentWeatherDiv(todaysSection, currWeather);

    // Create div for forecast info (next days/hourly)
    const forecastSection = document.createElement('div');
    forecastSection.id = 'forecastSection';
    swapToDaily(forecastSection, currWeather);

    // Add everything to the container
    container.append(todaysSection, forecastSection);

    return container;
}

function createCurrentWeatherDiv(container, jsonObj) {
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
        if(switchUnitsButton.classList.contains('switched')) {
            currentTemp.textContent = `${jsonObj.tempF} \xB0F`;
            switchUnitsButton.textContent = 'Switch to \xB0C';
        } else {
            currentTemp.textContent = `${jsonObj.tempC} \xB0C`;
            switchUnitsButton.textContent = 'Switch to \xB0F';
            switchUnitsButton.classList.toggle('switched');
        }
    });
    infoDiv.append(currentCondition, currentLocation, currentTemp, switchUnitsButton);

    const changeLocationsInput = document.createElement('input');
    changeLocationsInput.id = 'changeLocationsInput';
    changeLocationsInput.setAttribute('type', 'search');
    changeLocationsInput.setAttribute('placeholder', 'New city...');
    changeLocationsInput.addEventListener('keypress', (event) => {
        if(event.code === 'Enter') {
            if(changeLocationsInput.value === '' || changeLocationsInput.value === undefined
                || changeLocationsInput.value === null) {
                return;
            } else {
                const newJsonObj = getWeatherForLocation();
                createCurrentWeatherDiv(container, newJsonObj);
            }
        }
    });
    leftDiv.append(infoDiv, changeLocationsInput);

    container.appendChild(leftDiv);
}

function swapToDaily(container, jsonObj) {
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'buttonDiv';
    const forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecastDiv';

    const dailyButton = document.createElement('button');
    dailyButton.id = 'dailyButton';
    dailyButton.textContent = 'Daily';
    dailyButton.addEventListener('click', (event) => {
        if(!dailyButton.classList.contains('switched')) {
            swapToDaily(container, jsonObj);
            dailyButton.classList.toggle('switched');
            hourlyButton.classList.toggle('switched');
        }

        event.stopPropagation();
    });
    const hourlyButton = document.createElement('button');
    hourlyButton.id = 'hourlyButton';
    hourlyButton.textContent = 'Hourly';
    hourlyButton.addEventListener('click', (event) => {
        if(!hourlyButton.classList.contains('switched')) {
            swapToHourly(container, jsonObj);
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
    nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].maxDegF} \xB0F}`;
    nextDayTemps.addEventListener('click', (event) => {
       if(!nextDayTemps.classList.contains('clicked')) {
           nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegC} \xB0C | ${jsonObj.nextDays[0].maxDegC} \xB0C}`;
           nextDayTemps.classList.toggle('clicked');
       } else {
           nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].maxDegF} \xB0F}`;
           nextDayTemps.classList.toggle('clicked');
       }
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
    thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].maxDegF} \xB0F}`;
    thirdDayTemps.addEventListener('click', (event) => {
        if(!thirdDayTemps.classList.contains('clicked')) {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegC} \xB0C | ${jsonObj.nextDays[1].maxDegC} \xB0C}`;
            thirdDayTemps.classList.toggle('clicked');
        } else {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].maxDegF} \xB0F}`;
            thirdDayTemps.classList.toggle('clicked');
        }
    });
    thirdDayCard.append(thirdDayDate, thirdDayIcon, thirdDayTemps);
    forecastDiv.append(nextDayCard, thirdDayCard);

    container.append(buttonDiv, forecastDiv);
}