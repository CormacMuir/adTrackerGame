# Readme

All code can be found in the SRC folder. 
In here we have all the components of the chrome extension:	
*manifest.json
* popup.html
* popup.js
* background.js
* css: contains the stylesheet for the extension 
* font: contains the google font used within the extension
* imgs: contains any images or icons used within the extension
* scripts: contains all JavaScript files used by the extension including the client-side file for the Socket.IO connection

We also have a folder called "server" containing the server files, if this was to be published to the Chrome Extension store we would remove this folder
however for the purposes of the project the server folder has been left inside.	

## Build instructions

There is already a trackerlist.txt however to retrieve an updated copy download from: https://github.com/notracking/hosts-blocklists/blob/master/adblock/adblock.txt
The python script "blocklistParse.py" can then be ran, generating an updated JavaScript object representation of the blocklist
The game can then be installed by navigating to the Google Chrome browser, typing "chrome://extensions" into the address bar and enabling "developer mode" in the top right
Then, select "Load unpacked" and select the "SRC" folder, the game is now installed.

### Requirements

* Python 3.7 (if you wish to generate a new blocklist)
* Google Chrome (Developed and tested on Version 99.0.4844.84)
* Tested on Windows 10