Rest API vs Crud API for server communication and database access.

CRUD API suitable selection as the database will hold records which will be added, updated and deleted.
Makes sense for context of project
[link](https://www.bmc.com/blogs/rest-vs-crud-whats-the-difference/#)

Project database AND react app will be hosted on AWS as this is a very cost effective way to host and 
deploy a scalable app which is robust and reliable.

Use noSQL for database as this is what DynamoDB uses (AWS serverless DB)

Project architecture will be a react app as it's relatively easy to use yet is a powerful way
to use javascript. I will also host the db on AWS.

Database for User data

[link](https://www.youtube.com/watch?v=g4qKydnd0vU tutorial for amplify)

Was going to setup react app and attempt to store data to dynamoDB manually however discovered AWS Amplify which is an AWS service provided specifically
for the setup of web/mobile app and includes auth etc [can look up] so going to run with that.


[link]https://levelup.gitconnected.com/building-your-own-adblocker-in-literally-10-minutes-1eec093b04cd
I've set aside the development of the infrastructure for the backend so that I can focus on the actual ad detecting, unsure where to begin so i'm
going to start by creaeting an ad blocker to get a better understanding of how detecting ads work and how to manipulate DOM to react to ad trackers.

First thing learned is the manifest.json file is a compulsory file required for all chrome extensions
[link]https://developer.chrome.com/docs/extensions/mv3/declare_permissions/

After completing tutorial I've learned a bit about how chrome extensions work however the way in which ads are detected are by manually searching the HTML for keywords such as "Advert" or "Promoted" so it doesn't actually interact with the ad trackers themselves and therefore the tutorial was useless in that sense.

https://github.com/notracking/hosts-blocklists/blob/master/adblock/adblock.txt
Found block list here^ going to create a python script which will parse the block list and create a javascript module file out of it, this js file can then be used as a dictionary to check if the current url that the user is visiting is actually ad tracker

So i've thought about and sketched up a casino idea in which players will browse for ads, for every ad they see they can build up "chips" like they would in a casino and there are different ways to acquire chips. Each way has an associated risk with it, for example one way could be to bet a certain number of "chips" and then set a target goal of how many ad trackers you think you can find. The closer to this value you can get the more you get however if you go over the value then you go "bust"

AWS amplify also probably wont work due to the conflict between GraphQL and npm nodejs? i think?


Finally got ad tracker detection working however after manually reviewing all the web requests made from the sites it seems a lot are going undetected which suggests to me that i will need to improve my list of ad trackers that I currnetly have

[link]https://developer.chrome.com/docs/extensions/reference/storage/ read this and found the function "onChanged" which is exactly what I need, can use this listener as a trigger to update popup.html and will also use for future features.

So encountered a bug with googles "content security policy" which prevents external scripts from being accessed e.g. the cdn hosting bootstrap however after finding 2 links: 
[link]https://stackoverflow.com/questions/17789426/whitelist-multiple-domains-in-content-security-policy
[link]https://stackoverflow.com/questions/34950009/chrome-extension-refused-to-load-the-script-because-it-violates-the-following-c
I was able to whitelist the domains and JQuery and bootstrap now work. 

Got loading icon from loading.io

I've got a decent working version of single player stick or twist however I have since encountered the issue of working out how to detect when there are no more web requests to be made when loading a website i.e. that there can be no more ad trackers detected. The possible solution that I'm going to try is creating a content script that is run on "document_end" which sends a "message" to chrome runtime. What this means is that I should have a mechanism of talking to the background page and alerting it once a page is fully rendered and can then perform an action when this message is received. In this case the action will be sending a flag to the extension that this turn is over and all ad trackers that COULD be detected, have been detected. Info found on the following pages.
[link]https://stackoverflow.com/questions/55255619/chrome-extension-content-script-at-both-document-start-and-document-end
[link]https://developer.chrome.com/docs/extensions/mv3/messaging/

Found a tutorial on making a multiplayer game using socket.io [link]https://socket.io/
[link]https://dev.to/asciiden/how-to-use-socket-io-not-the-chat-3l21

So after extensive research into socket.io and completing the tutorial I have a firm grasp on the fundamentals of the library. I also think I have a rough understanding of how I will implement the library in my use case. The tutorial I used DID feature multiplayer, that is that 2 clients (or more) could interact with one another however there was no sense of turns and each client could perform actions whenever they pleased. I have sourced that it is possible to get the id of each connection and so i have a way of identifying each user as a player (1 or 2) and then can emit messages to particular users depending on who's turn it is.

So i've started by adapting the tutorial given so that each client can only interact with the site in turn, this should give me the "turn-based" aspect of the game. 

A lot of online material for socket.io is dated as its still very active and constantly updated, took a while to find out how to gettotal number of tonnections however found at the following link [link]https://stackoverflow.com/questions/10275667/socket-io-connected-user-count

Adapted the tutorial I found to work on a turn based system, i now need to port this over to my game and incorproate the server client aspects into the ad game.

My final step before I fully start merging single player and multiplayer aspects of the game is to practice creating "rooms" in socket.io. This means that each pair of players will have their own game environment and will NOT interfere with others

So i have finished working on the standalone socket.io project which includes a "lobby" feature, i.e. many players can play the game however can only interact with their one other opponent in a turn based fashion. I wanted to work on this separately to my standalone single player app as I felt if I could get the skeleton of socket.io written then it would be easy to drop sections of my ad game into the socket.io framework.