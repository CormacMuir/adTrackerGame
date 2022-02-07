# 30/9 
**4 hours**  looking for research papers and reading through some material sent by advisor

# 7/10
**4 hours** looking at blacklight, the source code for blacklight and thinking about how the backend infrastructure for game could work

# 14/10
**5 hours** reading further material and then deciding that I will attempt to host this projects server side logic on AWS services. Spent time deciding which AWS services may be of use. And designed a rough sketch of architecture

# 18/10
**3 hours** began implementing a NoSQL database using AWS' dynamoDB however ran into problems with communication between react app and database

# 20/10
**4 hours** resolved issues with db communication however scrapped the use of separate react app and dynamoDB due to over complicating . Now investigating AWS amplify

# 22/10 
**3 hours** After investigating AWS Amplify it seems like this is the ideal framework for my devleopment and I started readig documentation and watching web tutorials

# 24/10
**4 hours** Worked through Amplify tutorial and managed to get a react app up, login functionality as well as communcation with a DynamoDB. Need to work towards full user tables made.

# 27/10
**5 hours** Worked on amplift project and spent most of the time stuck on issues regarding communication with DynamoDB, plan is to come back to this after looking at scraping ad data and considering game 

# 01/11
**2 hours** Spent some time thinking about gameplay and drew up some ROUGH sketches in notepad about what game might look like along with how user interface might work

# 03/11
**2 hour** Developing ad blocker so i can extract the necessary ideas needed to develop ad tracker detection.
**2 hours** found block list that seems to be useful called adblock.txt, researched more on google chrome extension development.


# 01/12
**4 hours** finally got extension working, able to obtain dom data and can retrieve current page data, can now begin focusing on logic
**1 hour** sketched up a design for "casino" idea, could be interesting.

# 05/12
**4 hours** spent workin on js to allow me to detect ad trackers, wrking successfully next step is integrating with popup.html/popup.js and then server comms

# 09/12

**2 hours** got live ad counting working with dynamic html popup, user an now see a live counter of how many ads they have seen
**0.5 hours** fixed a bug where when popup.html was closed and reopened the live ad counter would reset until another ad tracker was found

# 14/12
**4 hours** got first working version of single player stick or twist game working, need to iron out some bugs however after this is working at a good level i will look to implement some form of multiplayer version

# 15/12
**4 hours**
Completed 2/4 tasks set out in plan, checks to ensure same website can't be used within same game work and began work on turn based play. Popup updated with correct data now.

# 16/12
**2 hours** spent time working on cleaning up javascript functions and also worked on wrapping different HTML elements that were part of different game screens in class tags to allow for cleaner JS.(e.g "ResultScreen")

# 20/12
**1 hour** fixed bug which prevented JQuery from being accessbile due to content security policy set by google.

# 22/12
**6 hours** Got loading animation working, disabled making moves whilst a turn was in progress, added timeout for listneing for ad trackers, 

# 06/01
**20 hours** Forgot to log time spent, hence the large number of hours spent. Notes, plan and git commits detail what exactlty was done, single player version is complete, still needs styled but moving onto multuplayer now.

# 16/01 - 19/01
**15 hours** Researching socket.io material, learning how the library works and completed a tutorial. Have a good idea of how socket.io will be useful in my project.

# 20/01
**4 hours** Adapted the tutorial to work on a turn based system, clients can be identified by server and if its not their turn they must wait for the other player. This is how my final game will work and thus is excellent progress. Next steps include taking the standalone multiplayer interactions i've developed and merge them with my single player game.

# 24/01
**2 hours** Worked on 'rooms' so that users can see list of open games

# 26/01
**7 hours** Managed to finish my test application to get all the building blocks of socket.io working. Many different "lobbies" can have their own turn-based interactions and there is a 'live' lobby screen which players can see all available games from and join accordingly
Also added MongoDB and created a db however not integrated yet.

# 28/01-31/01
**~10hours** Attempting to resolve the headache of integrating socket.io.

# 04-06/02 
**~15hours** Finally got socket.io working and the sockets persisting between pages, can finally start to actually work and integrate game logic