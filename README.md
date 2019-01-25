# legosets-API

##Prerequisites

Mongodb `sudo apt install -y mongodb`

Importing data:

`mongoimport --db lego --collection legosets --file data/legoimport.json --jsonArray`

##Run

`npm install`

`npm start`

Default on localhost:3000/api

##Teste API i postman

POST: localhost:3000/api/sets

sett Body: Raw (application/json)  
`{"setid": "4111343243242"}`  
evt. sett Content-Type application/json i headers


Markdown
(linebreaks: two spaces)
