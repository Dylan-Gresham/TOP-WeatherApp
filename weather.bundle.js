"use strict";(self.webpackChunktop_weatherapp=self.webpackChunktop_weatherapp||[]).push([[261],{628:(e,t,n)=>{n.r(t),n.d(t,{currLocation:()=>r,getWeatherForLocation:()=>c});const o="30e3d1a9c51d4f939bf200856231909";let r="Los Angeles";async function c(e){try{return await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${o}&q=${e}&days=3`,{mode:"cors"}).then((t=>{if(t.ok)return r=e,function(e){return e.json().then((e=>({city:e.location.name,region:e.location.region,country:e.location.country,icon:e.current.condition.icon,tempC:e.current.temp_c,tempF:e.current.temp_f,windM:e.current.wind_mph,windK:e.current.wind_kph,windDir:e.current.wind_dir,humidity:e.current.humidity,condition:e.current.condition.text,feelsLikeC:e.current.feelslike_c,feelsLikeF:e.current.feelslike_f,chanceOfRain:e.forecast.forecastday[0].day.daily_chance_of_rain,nextDays:i(e),todayHourly:a(e)})))}(t);throw new Error(`Weather Fetch failed for ${e}`)})).then((e=>e)).catch((e=>{console.error(`Error: ${e.message}`)}))}catch(e){return void console.error(`Error: ${e.message}`)}}function i(e){let t=[];for(const n of e.forecast.forecastday)t.push({date:n.date,iconURL:n.day.condition.icon,maxDegC:n.day.maxtemp_c,maxDegF:n.day.maxtemp_f,minTempC:n.day.mintemp_c,minTempF:n.day.mintemp_f,avgTempC:n.day.avgtemp_c,avgTempF:n.day.avgtemp_f});return t.shift(),t}function a(e){const t=e.location.localtime.split(" ")[1].split(":")[0];let n=[];for(const t of e.forecast.forecastday[0].hour)n.push({hour:t.time.split(" ")[1].split(":")[0],tempC:t.temp_c,tempF:t.temp_f,condition:t.condition.text,iconURL:t.condition.icon,chanceOfRain:t.chance_of_rain});return n.splice(0,parseInt(t)),n}}},e=>{e(e.s=628)}]);