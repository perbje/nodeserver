# Legosets-API

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



