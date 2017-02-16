# Raspberry Pi Clock

A quick and simple Raspberry Pi touchscreen clock with Philips hue, Tado, Dark Sky and Philips TV API controls/data

This project is designed to run on a Raspberry Pi with a 7" touchscreen (800x480).

It uses the Philips hue API, DarkSky API, the tadoº API and the JointSpace API.

* Philips hue docs: https://developers.meethue.com/documentation/getting-started
* DarkSky API docs: https://darksky.net/dev/
* tadoº API info: http://blog.scphillips.com/posts/2017/01/the-tado-api-v2/
* JointSpace docs: http://jointspace.sourceforge.net

## Philips hue
You'll need to create a user on the hue Debug Tool by following the instructions here: https://developers.meethue.com/documentation/getting-started  
Copy the user ID and add it where you see "YOURHUEUSERID".  

Then find your hue groups - you can add as many as you like, but I just wanted to turn all light and bedroom lights on and off as this is a bedside clock).  
My bedroom light group is 2, the "all lights" group is 0.  

## DarkSky
Since I'm in the UK, I use the "uk2" DarkSky API units.  
You can choose the following units instead:  
* auto: automatically select units based on geographic location
* ca: same as si, except that windSpeed is in kilometres per hour
* uk2: same as si, except that nearestStormDistance and visibility are in miles and windSpeed is in miles per hour
* us: Imperial units (the default)
* si: SI units

## tadoº
I use this to get the current internal temperature, have a look at the API docs and you can also add the set temperature and other data if you want.  

## JointSpace
The documentation should walk you through how to use this. I use the ambilight state to detect if the TV is on - if you don't have an ambilight TV, you can use something else to detect the state of the TV. (I eventually plan on using the ambilight data to change the colour of the hue bulbs, which is why I'm using that).  

The API does not work if the TV if off or on standby, so you could use that instead.  

### Lastly
This runs on Firefox in kiosk mode. You can find tutorials on the web about how to get the pi to boot into a browser running a local file in kiosk mode with no cursor and turning off screen blanking.  

The screen changes colour from white to black (with red text) between the hours of 10pm-7am. This is changeable or removeable in display.js.  

At some point, I might also add a control to turn the heating up/down with tadoº.  

I'd also reduce the screen brightness, especially for nighttime - if you're using it as a bedside clock like me.  

After some trial and error, I found this works well for me:

* SSH into the pi
* sudo nano /sys/class/backlight/rpi_backlight/brightness
* set brightness to 12 (readable during the day and not too bright at night)

I'm using this touchscreen: https://www.modmypi.com/raspberry-pi/screens-and-displays/raspberry-pi-7-touchscreen-display-official and https://www.modmypi.com/raspberry-pi/cases/7-touchscreen-cases/raspberry-pi-7-touchscreen-display-case-black, so you'll also have to rotate the screen 180º -

* SSH into the pi
* sudo nano /boot/config.txt
* add lcd_rotate=2 to the file
* save and reboot

