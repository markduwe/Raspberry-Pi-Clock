// change these values to reflect your setup
// Group 0 is the defaut "all lights group"
// Group 2 is my bedroom - change this to whatever you want
// I detect ambilight state to check if the TV is on. You can change it to something else if you don't have an ambilight TV

var group0onoff = 'YOURHUEBRIDGEIP/api/YOURHUEUSERID/groups/0/action', // this sets the light state
	group0state = 'YOURHUEBRIDGEIP/api/YOURHUEUSERID/groups/0/',  // this reads the light state
	bedonoff = 'YOURHUEBRIDGEIP/api/YOURHUEUSERID/groups/2/action', // this sets the light state
	bedstate = 'YOURHUEBRIDGEIP/api/YOURHUEUSERID/groups/2/',  // this reads the light state
	tado = 'https://my.tado.com/api/v2/homes/YOURTADOUSER/zones/1/state?username=USERNAME&password=PASSWORD', // tado url
	tv = 'http://YOURAMBILIGHTTVIP:1925/1/input/key', // this turns the TV off
	tvon = 'http://YOURAMBILIGHTTVIP:1925/1/ambilight/measured', // change this if you don't have an ambilight TV
	weatherData = 'https://api.darksky.net/forecast/YOURDARKSKYAPIKEY/YOURLATITUDE,YOURLONGITUDE?units=uk2&callback=?'; // gets the weather data

$(function() {

	// load weather, tado and set date
	weather();
	tadoStuff();
	$('#date').html(moment().format('dddd, MMMM Do, YYYY'));

	window.addEventListener('contextmenu', function(e) { e.preventDefault(); }); // stop accidental contect menus

	// update lights and TV state every 5 seconds
	setInterval( function() {

		// check lights states
		$.getJSON(group0state, function(all){

			$.getJSON(bedstate, function(bed){

				// all lights on
				if(all.state.all_on == true && all.state.any_on == true && bed.state.all_on == true && bed.state.any_on == true) {
					$('button:not(#tvoff)').removeClass('on');
					$('#allon').addClass('on');
					$('#bedon').addClass('on');
				}
				// most lights on
				if(all.state.all_on == false && all.state.any_on == true && bed.state.all_on == true && bed.state.any_on == true) {
					$('button:not(#tvoff)').removeClass('on');
					$('#allon').addClass('on');
					$('#bedon').addClass('on');
				}
				// most lights on
				if(all.state.all_on == false && all.state.any_on == true && bed.state.all_on == false && bed.state.any_on == true) {
					$('button:not(#tvoff)').removeClass('on');
					$('#allon').addClass('on');
					$('#bedon').addClass('on');
				}
				// bedroom off, but others on
				if(all.state.all_on == false && all.state.any_on == true && bed.state.all_on == false && bed.state.any_on == false) {
					$('button:not(#tvoff)').removeClass('on');
					$('#bedoff').addClass('on');
					$('#allon').addClass('on');
				}
				// all lights off
				if(all.state.all_on == false && all.state.any_on == false) {
					$('button:not(#tvoff)').removeClass('on');
					$('#alloff').addClass('on');
				}

			});

		});

		// check TV state
		$.getJSON(tvon, function(data){

			// if ambilight has data, TV is on
			if(exists(data.layer1)) {
				$('#tvoff').addClass('on');
			} else {
				$('#tvoff').removeClass('on');
			}

		});

	}, 5000);

	// reload weather and tado data every hour
	setInterval( function() {

		tadoStuff();

		weather();

	}, 3600000);

	// make the buttons do stuff
	$('#allon').on('click', function(){
		$.ajax({
		    type: 'PUT',
		    url: group0onoff,
		    data: '{"on": true, "bri": 100}'
		});
	});

	$('#alloff').on('click', function(){
		$.ajax({
		    type: 'PUT',
		    url: group0onoff,
		    data: '{"on": false}'
		});
	});

	$('#bedon').on('click', function(){
		$.ajax({
		    type: 'PUT',
		    url: bedonoff,
		    data: '{"on": true, "bri": 100, "hue":65280}'
		});

	});

	$('#bedoff').on('click', function(){
		$.ajax({
		    type: 'PUT',
		    url: bedonoff,
		    data: '{"on": false}'
		});
		$.ajax({
		    type: 'PUT',
		    url: api+'3/state',
		    data: '{"on": false}'
		});
	});

	$('#tvoff').on('click', function(){
		$(this).removeClass('on');
		$.ajax({
		    type: 'POST',
		    dataType: 'json',
		    url: tv,
		    data: '{"key": "Standby"}'
		});
	});

	// update date every 10 minutes
	setInterval( function() {
		$('#date').html(moment().format('dddd, MMMM Do, YYYY'));
	}, 600000);

	// update time every second
	setInterval( function() {
		$('#time').html(moment().format('HH:mm')).attr('datetime', moment().format('HHmm'));
		daynight();
	}, 1000);


});

// turns the screen dark between 10pm and 7am
function daynight() {
	if($('#time').attr('datetime') > '0700' && $('#time').attr('datetime') < '2200') {
		$('body').removeClass('night').addClass('day');
	} else {
		$('body').removeClass('day').addClass('night');
	}
}

// gets tado data
function tadoStuff() {
	$.getJSON(tado, function(data){
		var current = data.sensorDataPoints.insideTemperature.celsius;
		$('#tado').html('<strong><i class="wi wi-barometer"></i> tado&deg; '+ current + '<i class="wi wi-celsius"></i></strong>');
	});
}

// gets weather data (seriously needs cleaning up and work)
function weather() {

	$.getJSON(weatherData, function(weather){

		var summary = weather.currently.summary,
			summaryIcon = weather.currently.icon,
			num = weather.currently.cloudCover,
			moon = weather.daily.data[0].moonPhase,
			sunrise = weather.daily.data[0].sunriseTime,
			sunset = weather.daily.data[0].sunsetTime,
			pred = '';
		if(summaryIcon == 'wind') {summaryIcon = 'strong-wind'};
		if(num == 0) {var text = 'Clear', cIcon = 'wi-clear-day'};
		if(num > 0 && num <= 0.4) {var text = 'Scattered Clouds', cIcon = 'wi-day-cloudy-high'};
		if(num >= 0.41 && num <= 0.75) {var text = 'Broken Clouds', cIcon = 'wi-cloudy'};
		if(num >= 0.76 && num <= 1) {var text = 'Overcast', cIcon = 'wi-cloud'};
		if(moon => 0.99 && moon <= 0.01) {var moonPhase = '<i class="wi wi-moon-alt-new"></i> New Moon'};
		if(moon > 0.01 && moon < 0.05) {var moonPhase = '<i class="wi wi-moon-alt-waxing-cresent-1"></i> Waxing Crescent Moon'};
		if(moon >= 0.05 && moon < 0.1) {var moonPhase = '<i class="wi wi-moon-alt-waxing-cresent-2"></i> Waxing Crescent Moon'};
		if(moon >= 0.1 && moon < 0.15) {var moonPhase = '<i class="wi wi-moon-alt-waxing-cresent-3"></i> Waxing Crescent Moon'};
		if(moon >= 0.15 && moon < 0.2) {var moonPhase = '<i class="wi wi-moon-alt-waxing-cresent-4"></i> Waxing Crescent Moon'};
		if(moon >= 0.2 && moon < 0.25) {var moonPhase = '<i class="wi wi-moon-alt-waxing-cresent-5"></i> Waxing Crescent Moon'};
		if(moon == 0.25) {var moonPhase = '<i class="wi wi-moon-alt-first-quarter"></i> 1st Quarter Moon'};
		if(moon > 0.25 && moon < 0.3) {var moonPhase = '<i class="wi wi-moon-alt-waxing-gibbous-1"></i> Waxing Gibbous Moon'};
		if(moon >= 0.3 && moon < 0.35) {var moonPhase = '<i class="wi wi-moon-alt-waxing-gibbous-2"></i> Waxing Gibbous Moon'};
		if(moon >= 0.35 && moon < 0.4) {var moonPhase = '<i class="wi wi-moon-alt-waxing-gibbous-3"></i> Waxing Gibbous Moon'};
		if(moon >= 0.4 && moon < 0.45) {var moonPhase = '<i class="wi wi-moon-alt-waxing-gibbous-4"></i> Waxing Gibbous Moon'};
		if(moon >= 0.45 && moon < 0.5) {var moonPhase = '<i class="wi wi-moon-alt-waxing-gibbous-5"></i> Waxing Gibbous Moon'};
		if(moon == 0.5) {var moonPhase = '<i class="wi wi-moon-alt-full"></i> Full Moon'};
		if(moon > 0.5 && moon < 0.55) {var moonPhase = '<i class="wi wi-moon-alt-waning-gibbous-1"></i> Waning Gibbous Moon'};
		if(moon >= 0.55 && moon < 0.6) {var moonPhase = '<i class="wi wi-moon-alt-waning-gibbous-2"></i> Waning Gibbous Moon'};
		if(moon >= 0.6 && moon < 0.65) {var moonPhase = '<i class="wi wi-moon-alt-waning-gibbous-3"></i> Waning Gibbous Moon'};
		if(moon >= 0.65 && moon < 0.7) {var moonPhase = '<i class="wi wi-moon-alt-waning-gibbous-4"></i> Waning Gibbous Moon'};
		if(moon >= 0.7 && moon < 0.75) {var moonPhase = '<i class="wi wi-moon-alt-waning-gibbous-5"></i> Waning Gibbous Moon'};
		if(moon == 0.75) {var moonPhase = '<i class="wi wi-moon-alt-third-quarter"></i> Last Quarter Moon'};
		if(moon > 0.75 && moon < 0.8) {var moonPhase = '<i class="wi wi-moon-alt-waning-crescent-1"></i> Waning Crescent Moon'};
		if(moon >= 0.8 && moon < 0.85) {var moonPhase = '<i class="wi wi-moon-alt-waning-crescent-2"></i> Waning Crescent Moon'};
		if(moon >= 0.85 && moon < 0.9) {var moonPhase = '<i class="wi wi-moon-alt-waning-crescent-3"></i> Waning Crescent Moon'};
		if(moon >= 0.9 && moon < 0.95) {var moonPhase = '<i class="wi wi-moon-alt-waning-crescent-4"></i> Waning Crescent Moon'};
		if(moon >= 0.95 && moon < 0.99) {var moonPhase = '<i class="wi wi-moon-alt-waning-crescent-5"></i> Waning Crescent Moon'};

		pred += '<strong><i class="wi wi-'+summaryIcon+'"></i> '+summary + '</strong><br />';

		pred += '<i class="wi wi-thermometer"></i> ' + weather.currently.temperature+'<i class="wi wi-celsius"></i> <small>(Feels like '+weather.currently.apparentTemperature+'<i class="wi wi-celsius"></i>)</small><br />';

		pred += '<small>Max: '+weather.daily.data[0].temperatureMax+'<i class="wi wi-celsius"></i> | Min: '+weather.daily.data[0].temperatureMin+'<i class="wi wi-celsius"></i></small><br />';

		pred += '<i class="wi wi-strong-wind"></i> Wind: <i class="wi wi-wind towards-'+weather.currently.windBearing+'-deg"></i> '+degToCompass(weather.currently.windBearing)+' '+weather.currently.windSpeed+' mph<br />';
		pred += '<i class="wi '+cIcon+'"></i> '+ text + '<br />';

		if(weather.currently.precipIntensity > 0) {
			pred += '<i class="wi wi-rain"></i> Rain: '+Math.round(weather.currently.precipProbability * 100, 2)+'% '+Math.round(weather.currently.precipIntensity * 10, 2)+'mm/hr '+weather.currently.precipType+'<br />';
		} else {
			pred += '<i class="wi wi-rain"></i> Rain: '+Math.round(weather.currently.precipProbability * 100, 2)+'%<br />';
		}

		if(weather.currently.nearestStormDistance > 0) {
			pred += 'Nearest rain: <i class="wi wi-wind towards-'+weather.currently.nearestStormBearing+'-deg"></i> '+degToCompass(weather.currently.nearestStormBearing)+' '+weather.currently.nearestStormDistance+' miles<br />';
		}

		pred += '<i class="wi wi-humidity"></i> Humidity: ' + Math.round(weather.currently.humidity * 100) + '%<br />';

		if(exists(weather.daily.data[0].moonPhase)) {
			pred += ''+moonPhase+'<br />';
		}

		pred += '<i class="wi wi-sunrise"></i> '+moment.unix(sunrise).format('HH:mm a')+' | <i class="wi wi-sunset"></i> '+moment.unix(sunset).format('HH:mm a');

		$('#weather').html(pred);

	});

}

// helper
function exists(data) {

	if(!data || data==null || data=='undefined' || typeof(data)=='undefined') return false;
	else return true;

}

// works out cardinal compass directions
function degToCompass(num) {

	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
	return arr[(val % 16)];

}