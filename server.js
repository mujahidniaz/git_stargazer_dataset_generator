var express = require('express') //npm install express
  , bodyParser = require('body-parser') // npm install body-parser
  ,path = require("path")// including path liberary
  , http = require('http')// npm install http liberary
  ,stargazer = require('./githubStargazer');// including stargazer module from project 
  const port = 9898;// App port.
const server = express()    // // Creating express.js App
server.use(bodyParser.json()); // Setting up body persor type as JSON for API End point.

server.use("/public", express.static(path.join(__dirname, 'public')));   /// Setting 'Public' named folder as public for static contents like images and libraries
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});





server.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');  /// returning the index.html file for the base url
});

server.get("/gitstargazer/",async(req, res) => {        /// API GET end point which calls Gitstargazer Module's GetStarHistory function and provides the url for repo.
  let url = req.query.url;
  //console.log(url);
  result =await stargazer.getStarHistory(url)
  .then(result => res.send(result) )
  .catch(err => res.send(err))
});
 