# Raspberry-Pi-Clock

A quick and simple Raspberry Pi touchscreen clock with Philips hue, Tado, Dark Sky and Philips TV API controls/data

This project is designed to run on a Raspberry Pi with a 7" touchscreen (800x480).

It uses the Philips hue API, DarkSky API, the tadoº API and the JointSpace API.

* Philips hue docs: https://developers.meethue.com/documentation/getting-started
* DarkSky API docs: https://darksky.net/dev/
* tadoº API info: http://blog.scphillips.com/posts/2017/01/the-tado-api-v2/
* JointSpace docs: http://jointspace.sourceforge.net

## Philips hue
You'll need to create a user on the hue Debug Tool by following the insturctions here: https://developers.meethue.com/documentation/getting-started
Copy the user ID and add it where you see "YOURHUEUSERID".  

Then find your hue groups - you can add as many as you like, but I just wanted to turn all light and bedroom lights on and off as this is a bedside clock).  
My bedroom light group is 2, the "all lights" group is 0.  

## DarkSky
Since I'm in the UK, I use the "uk2" DarkSky API units.  
You can choose the following units instead:  
* auto: automatically select units based on geographic location
* ca: same as si, except that windSpeed is in kilometers per hour
* uk2: same as si, except that nearestStormDistance and visibility are in miles and windSpeed is in miles per hour
* us: Imperial units (the default)
* si: SI units

## tadoº
I use this to get the current internal temperature, have a look at the API docs and you can also add the set temperature and other data if you want.  

## JointSpace
The documentation should walk you through how to use this. I use the ambilight state to detect if the TV is on - if you don't have an ambilight TV, you can use something else to detect the state of the TV.  

The API does not work if the TV if off or on standby, so you could use that instead.  
