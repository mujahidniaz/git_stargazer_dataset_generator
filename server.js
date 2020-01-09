var express = require('express') //npm install express
  , bodyParser = require('body-parser') // npm install body-parser
  , fs = require('fs')
  ,path = require("path")
  , http = require('http')
  ,stargazer = require('./githubStargazer');
  const port = 9898;
const server = express()
server.use(bodyParser.json());
server.use("/public", express.static(path.join(__dirname, 'public')));
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});





server.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.get("/gitstargazer/",async(req, res) => {
  let url = req.query.url;
  console.log(url);
  result =await stargazer.getStarHistory(url)
  .then(result => res.send(result) )
  .catch(err => res.send(err))
   
  //res.send("hello");
});
 