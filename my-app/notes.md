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
