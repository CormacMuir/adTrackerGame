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