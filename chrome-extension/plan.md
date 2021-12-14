# 09/12
The plan for today is to attempt to get a live ad counter running, this means that i'll write some js to a)manipulate chrome storage to keep track of the number of ads encountered throughout the browsing session and b) to dynamically update popup.html to create a live tracker.

Previous task completed, going to see if I can now implement a very rudimentary stick or twist game using 2 buttons. Also need to fix bug where the adcounter doesnt ever reset.

# 14/12
Created stick or twist game, no need for twist button rn as loading a new web page IS twisting however there is some bugs i need to iron out. Firstly need to have a way of concretely determining ONE twist, as ad trackers come in over a period of time so will need to disable the ability to twist for X number of seconds or have a timeout based on how frequently trackers are coming through. Also want to disable the ability to consecutively visit the same domain and so will implement that. Once I've done that i'll look at moving to server/client infrastructure.