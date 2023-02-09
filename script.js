(function ($) {
    // Local Storage will not save again a city that has been previuosly searched.
    let searchHistory= []
    if (localStorage.getItem("history") != null) {
        searchHistory = JSON.parse(localStorage.getItem("history"))
        displayHistory(searchHistory)
    }
    const todayContainer = $('#today')
    const fiveDays = $('#forecast')
    const apiKeys = "b191c6a6f6957fa1c90dfe348c7a27af"
    const history = JSON.parse(localStorage.getItem('saveWeather')) || []
    // API Request for 5-day weather forecast.
    function getForecast(searchValue) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=imperial&appid=${apiKeys}`;
        fetch(url).then((response) => response.json())
            .then((data) => displayForecast(data));
    }
    // API Request for current day weather.
    function getWeather(searchValue) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=imperial&appid=${apiKeys}`;
        fetch(url).then((response) => response.json())
            .then((data) => {
                displayWeather(data)
                getForecast(searchValue) 
                const cityInHistory= searchHistory.find(function (c) {
                    return c == searchValue                   
                })
                if (!cityInHistory) {
                    searchHistory.push(searchValue)
                    localStorage.setItem("history",JSON.stringify(searchHistory));
                    displayHistory(searchHistory)
                }
                
            });
    }
    // search the city entered in the search box.    
    $('#search').on('click', function(event){
        event.preventDefault()
        const cityName= $('#searchValue').val()  
        getWeather(cityName)
    })
    //Returning API Request
    function displayForecast(cityWeather) {
        $('#displayDays').empty()
    const forecastDays=[]
    for (let forecastDay of cityWeather.list){
        const day = dayjs(forecastDay.dt_txt).date();
        const dayOnArray= forecastDays.find(function (f) {
            if (day == dayjs(f.dt_txt).date()) {
                return true    
            }
            return false
        })      
        if (!dayOnArray && forecastDays.length < 5) {
            forecastDays.push(forecastDay)           
        }
    }
    // used string template to siplay 5 day future forecast dynamically.
    // added dayjs format to display the dates of the future forecast.
    for (let displayDay of forecastDays) {
        const currentDate= dayjs(displayDay.dt_txt).format('dddd MMMM D')
        const icon = displayDay.weather[0].icon
        const dayInfo=
        `<div class="card col-4">
            <div class="card-body">
                <h5 class="card-title">${currentDate}</h5>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="40"/>
                <h6 class="card-subtitle mb-2 text-muted">Temp ${displayDay.main.temp}</h6>
                <h6 class="card-subtitle mb-2 text-muted">Wind ${displayDay.wind.speed}</h6>
                <h6 class="card-subtitle mb-2 text-muted">Humidity ${displayDay.main.humidity}</h6>
            </div>
        </div>`
    $('#displayDays').append(dayInfo)    
    }
}
// used string template to display current day weather.
// added dayjs format to display the current day weather.
function displayWeather(dayWeather) {
    const currentDate= dayjs().format('dddd MMMM D')
    const icon = dayWeather.weather[0].icon
    const currentWeather=
    `<h5 class="card-title">${currentDate}</h5>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="100"/>
    <h2>${dayWeather.name}</h2>
    <h6 class="card-subtitle mb-2 text-muted">Temp ${dayWeather.main.temp}</h6>
    <h6 class="card-subtitle mb-2 text-muted">Wind ${dayWeather.wind.speed}</h6>
    <h6 class="card-subtitle mb-2 text-muted">Humidity ${dayWeather.main.humidity}</h6>` 
    $('#oneDayInfo').html(currentWeather)      
}
//This function adds the searched city to the history.
function displayHistory(history) {
    $('#savedHistory').empty()  
    for (let h of history) {
        const buttonHistory=`<button class="buttonHistory" data-city="${h}">${h}</button>`
        $('#savedHistory').append(buttonHistory)       
    }   
}
//This function retreives the forecast information from a previous searched city.
$('.buttonHistory').click(function (){
    const city = $(this).data('city')
    getWeather(city)
 
  })

})(jQuery);


