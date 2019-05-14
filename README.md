# Legosets-API

MyLegoSets is a small webapp for storing a single persons lego sets.

This project contains the API written using Node.js. It uses a mongoDB nosql-database. Security via JWT.
Built and served with Heroku: https://dashboard.heroku.com/apps/mylegosets-api

The frontend project is located: https://github.com/placbo/legosets-gui-react.

mLab: Database-as-a-Service for MongoDB.  
MongoDB: a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schemata.  
Heruko: Heroku is a cloud platform as a service (PaaS)
JWT: Jason web token. 

----------------------------

TODO: Oppsett heroku, oppsett mlab.

----------------------------

##Prerequisites

Mongodb: `sudo apt install -y mongodb`

Importing data:

`mongoimport --db lego --collection legosets --file data/legoimport.json --jsonArray`

## bruke mlab database:

Opprette .env-fil med innhold:

    MONGODB_URI=mongodb://<username>:<password>@ds119445.mlab.com:19445/mylegosets
    LOGIN_SECRET=<innloggingspassord for pcb, hashet>
    TOKEN_SECRET=<tokensecret>

Importing data to mlab:

`mongoimport -h ds161262.mlab.com:61262 -d heroku_lttmd0wz -c legosets -u USERNAME -p PASSWORD --file data/legoimport.json --jsonArray`

##Run

`npm install`

`npm start`

Default on localhost:3000/api

-- Gjerne bruk nodemon:

`sudo npm install -g nodemon`

`nodemon server.js`


##Teste API i postman

Lagret eksempler under egen collection

##Markdown
(linebreaks: two spaces)



