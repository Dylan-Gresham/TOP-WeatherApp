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
        return;
    } else {
        console.log('JSON Fetch Success!');
    }

    // Create main container
    const container = document.createElement('div');
    container.id = 'container';

    // Create div for today's weather
    const todaysSection = document.createElement('div');
    todaysSection.id = 'todaysSection';
    await createCurrentWeatherDiv(todaysSection, currWeather);

    // Create div for forecast info (next days/hourly)
    const forecastSection = document.createElement('div');
    forecastSection.id = 'forecastSection';
    await swapToDaily(forecastSection, currWeather);

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
    currentLocation.textContent = `${jsonObj.city}, ${jsonObj.region}, ${jsonObj.country}`;
    const currentTemp = document.createElement('h1');
    currentTemp.id = 'currentTemp';
    currentTemp.textContent = `${jsonObj.tempF} \xB0F`;
    const switchUnitsButton = document.createElement('button');
    switchUnitsButton.setAttribute('type', 'button');
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

        // Get the forecastSection
        const temps = document.querySelectorAll('.temp');
        temps.forEach((temp) => {
            temp.click();
        });

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
                const newJsonObj = await getWeatherForLocation(changeLocationsInput.value);
                await createCurrentWeatherDiv(container, newJsonObj);
            }
        }
    });
    leftDiv.append(infoDiv, changeLocationsInput);

    container.appendChild(leftDiv);
}

async function swapToDaily(container, jsonObj) {
    emptyElement(container);

    const buttonDiv = makeButtonDiv(container, jsonObj);

    const forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecastDiv';
    const nextDayCard = document.createElement('div');
    nextDayCard.classList.add('dayCard');
    const nextDayDate = document.createElement('p');
    nextDayDate.classList.add('dayDate');
    nextDayDate.textContent = jsonObj.nextDays[0].date;
    const nextDayIcon = document.createElement('img');
    nextDayIcon.classList.add('dayIcon');
    nextDayIcon.src = jsonObj.nextDays[0].iconURL;
    const nextDayTemps = document.createElement('h4');
    nextDayTemps.classList.add('dayTemps');
    nextDayTemps.classList.add('temp');
    nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].minTempF} \xB0F`;
    nextDayTemps.addEventListener('click', (event) => {
        if (!nextDayTemps.classList.contains('clicked')) {
            nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegC} \xB0C | ${jsonObj.nextDays[0].minTempC} \xB0C`;
            nextDayTemps.classList.toggle('clicked');
        } else {
            nextDayTemps.textContent = `${jsonObj.nextDays[0].maxDegF} \xB0F | ${jsonObj.nextDays[0].minTempF} \xB0F`;
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
    const thirdDayTemps = document.createElement('h4');
    thirdDayTemps.classList.add('dayTemps');
    thirdDayTemps.classList.add('temp');
    thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].minTempF} \xB0F`;
    thirdDayTemps.addEventListener('click', (event) => {
        if (!thirdDayTemps.classList.contains('clicked')) {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegC} \xB0C | ${jsonObj.nextDays[1].minTempC} \xB0C`;
            thirdDayTemps.classList.toggle('clicked');
        } else {
            thirdDayTemps.textContent = `${jsonObj.nextDays[1].maxDegF} \xB0F | ${jsonObj.nextDays[1].minTempF} \xB0F`;
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

    const buttonDiv = makeButtonDiv(container, jsonObj);

    let currPage = 1;
    const pageOne = document.createElement('div');
    pageOne.classList.add('hourlyPage');
    const pageTwo = document.createElement('div');
    pageTwo.classList.add('hourlyPage');
    const pageThree = document.createElement('div');
    pageThree.classList.add('hourlyPage');
    const prevPageButton = document.createElement('button');
    prevPageButton.setAttribute('type', 'button');
    prevPageButton.classList.add('pageButton');
    prevPageButton.textContent = '<';
    prevPageButton.addEventListener('click', (event) => {
        if (currPage === 1) {
            return;
        } else {
            currPage--;
            if (currPage === 1 && pageOne.childElementCount > 0
                && pageOne.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageOne);
            } else if (currPage === 2 && pageTwo.childElementCount > 0
                && pageTwo.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageTwo);
            } else if (currPage === 3 && pageThree.childElementCount > 0
                && pageThree.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageThree);
            } else {
                currPage++;
            }
        }

        event.stopPropagation();
    });
    const nextPageButton = document.createElement('button');
    nextPageButton.setAttribute('type', 'button');
    nextPageButton.classList.add('pageButton');
    nextPageButton.textContent = '>';
    nextPageButton.addEventListener('click', (event) => {
        if (currPage === 3) {
            return;
        } else {
            currPage++;
            if (currPage === 1 && pageOne.childElementCount > 0
                && pageOne.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageOne);
            } else if (currPage === 2 && pageTwo.childElementCount > 0
                && pageTwo.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageTwo);
            } else if (currPage === 3 && pageThree.childElementCount > 0
                && pageThree.childElementCount <= 8) {
                forecastDiv.removeChild(forecastDiv.lastChild);
                forecastDiv.appendChild(pageThree);
            } else {
                currPage--;
            }
        }

        event.stopPropagation();
    });
    const pageOneDot = document.createElement('button');
    pageOneDot.setAttribute('type', 'button');
    pageOneDot.classList.add('pageDot');
    pageOneDot.textContent = '\u2022';
    pageOneDot.addEventListener('click', (event) => {
        if (currPage !== 1 && pageOne.childElementCount > 0
            && pageOne.childElementCount <= 8) {
            forecastDiv.removeChild(forecastDiv.lastChild);
            forecastDiv.appendChild(pageOne);
            currPage = 1;
        }

        event.stopPropagation();
    });
    const pageTwoDot = document.createElement('button');
    pageTwoDot.setAttribute('type', 'button');
    pageTwoDot.classList.add('pageDot');
    pageTwoDot.textContent = '\u2022';
    pageTwoDot.addEventListener('click', (event) => {
        if (currPage !== 2 && pageTwo.childElementCount > 0
            && pageTwo.childElementCount <= 8) {
            forecastDiv.removeChild(forecastDiv.lastChild);
            forecastDiv.appendChild(pageTwo);
            currPage = 2;
        }

        event.stopPropagation();
    });
    const pageThreeDot = document.createElement('button');
    pageThreeDot.setAttribute('type', 'button');
    pageThreeDot.classList.add('pageDot');
    pageThreeDot.textContent = '\u2022';
    pageThreeDot.addEventListener('click', (event) => {
        if (currPage !== 3 && pageThree.childElementCount > 0
            && pageThree.childElementCount <= 8) {
            forecastDiv.removeChild(forecastDiv.lastChild);
            forecastDiv.appendChild(pageThree);
            currPage = 3;
        }

        event.stopPropagation();
    });


    const forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecastDiv';
    for (const hour of jsonObj.todayHourly) {
        const hourCard = document.createElement('div');
        hourCard.classList.add('hourCard');
        const hourNum = document.createElement('p');
        hourNum.classList.add('hourNum');
        hourNum.textContent = hour.hour;
        const hourIcon = document.createElement('img');
        hourIcon.classList.add('hourIcon');
        hourIcon.src = hour.iconURL;
        const hourTemp = document.createElement('h4');
        hourTemp.classList.add('hourTemp');
        hourTemp.classList.add('temp');
        hourTemp.textContent = `${hour.tempF} \xB0F`;
        hourTemp.addEventListener('click', (event) => {
            if (!hourTemp.classList.contains('switched')) {
                hourTemp.textContent = `${hour.tempF} \xB0C`;
                hourTemp.classList.toggle('switched');
            } else {
                hourTemp.textContent = `${hour.tempF} \xB0F`;
                hourTemp.classList.toggle('switched');
            }

            event.stopPropagation();
        });
        const hourChanceOfRain = document.createElement('p');
        hourChanceOfRain.classList.add('hourChanceOfRain');
        hourChanceOfRain.textContent = `${hour.chanceOfRain}%`;
        hourCard.append(hourNum, hourIcon, hourTemp, hourChanceOfRain);

        if (pageOne.childElementCount < 8) {
            pageOne.appendChild(hourCard);
        } else if (pageTwo.childElementCount < 8) {
            pageTwo.appendChild(hourCard);
        } else {
            pageThree.appendChild(hourCard);
        }
    }

    buttonDiv.append(prevPageButton, pageOneDot);
    if (pageTwo.childElementCount > 0 && pageTwo.childElementCount <= 8) {
        buttonDiv.appendChild(pageTwoDot);
    }

    if (pageThree.childElementCount > 0 && pageThree.childElementCount <= 8) {
        buttonDiv.appendChild(pageThreeDot);
    }
    buttonDiv.appendChild(nextPageButton);

    forecastDiv.appendChild(pageOne);
    container.append(buttonDiv, forecastDiv);
}

function makeButtonDiv(container, jsonObj) {
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'buttonDiv';
    const forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecastDiv';

    const dailyButton = document.createElement('button');
    dailyButton.setAttribute('type', 'button');
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
    hourlyButton.setAttribute('type', 'button');
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

    return buttonDiv;
}

function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.children[0]);
    }
}
