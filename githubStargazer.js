const axios = require('axios'); // Using axios library for API Calls.
let waitTime=200;                 // Wait time between API Calls in Milli seconds

const token = '4d5235a5cbc0c47688da990461694a04518a2bcc'; // Authentication token.
let resArray=[];  // successfull api calls array.
let catchArray=[]; // Failed API Calls array


// return [1,2, ..., n]
const range = n => Array.apply(null, {length: n}).map((_, i) => i + 1);
//console.log(range);
/**
 * get star history
 * @param {String} repo - eg: 'timqian/jsCodeStructure'
 * @param {String} token - github access token
 * @return {Array} history - eg: [{date: 2015-3-1,starNum: 12}, ...]
 */

 // Function that takes repo name and Aunthentication token to make api calls
 async function getStarHistory(repo, token) {
  resArray = [];
  const axiosGit = axios.create({
    headers: {
      Accept: 'application/vnd.github.v3.star+json',   /// According Git-Hub API Documentation header must have this Type to get timestamped data other wise it will only return users.
    },
  });

  /**
   * generate Urls and pageNums
   * @param {sting} repo - eg: 'timqian/jsCodeStructure'
   * @return {object} {sampleUrls, pageIndexes} - urls to be fatched(length <=10) and page indexes
   */
   async function generateUrls(repo) {

    const initUrl1 = `https://api.github.com/repos/${repo}/stargazers`;
    
    const initUrl = `https://api.github.com/repos/${repo}/stargazers`+'?access_token='+ token +'&per_page=100';   // used to get star info
    const initRes =  await axiosGit.get(initUrl);

    /** 
     * link Sample (no link when star < 30):
     * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=2>;
     * rel="next", 
     * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=4>; 
     * rel="last"
     */
    const link = initRes.headers.link;
    console.log(link);
    
    

    const pageNum = link ? /next.*?&page=(\d*).*?last/.exec(link)[1] : 1; // total page number
    console.log(pageNum);

    if(pageNum>100)    /// if total api calls are less than 100 then delay will be defaul which is 200 milli seconds but in case of more API calls than 100 delay must be minimum of 1 second =  1000 milli seconds.
    {
      waitTime=1000;
    }
    
    
    const pageIndexes = Array.from({length: pageNum}, (v, k) => k+1); // creating dymanic page index array  
    
    console.log('test'+ pageNum);
    
    
   const sampleUrls = pageIndexes.map(pageIndex => `${initUrl1}?page=${pageIndex}`+ '&access_token='+ token +'&per_page=100'); /// Sample URLs for getting stargazer info.
    console.log(sampleUrls);
    console.log("pageIndexes", pageIndexes);
    return { firstPage: initRes, sampleUrls, pageIndexes };
  }

  const { sampleUrls, pageIndexes, firstPage } = await generateUrls(repo);

  
//let paginArray =  chunkArray(sampleUrls,100)        /// dividing into chunks so that we can make more API calls with less delay and make longer delay between chunks. but it didnt work so leaving it commented

    for (let i = 0; i < sampleUrls.length; i++) {  // iterate over the pageURls and get 100 user per url
      console.log(i);
      
      axiosGit.get(sampleUrls[i])  // Get 100 users for each page using Get Request to API
          .then((response) => {

            
           // console.log(response.data[0]);
            response.data.forEach(element => {   /// Iterate over 100 Users details and extract required data\
              let currdata = {repo_name:repo,user:"",starred_at:""};  // Create a new Json object
             currdata.starred_at= element.starred_at;               // Assign Values
             currdata.user=element.user.login;
             resArray.push(currdata);                               // push to result array
            });
            
          }).catch(error => {
            console.log(error);
            catchArray.push(sampleUrls[i]);                       // if the URL fails . push it to the catchArray.
          })
      
      await timer(waitTime); // delayed between requests.     
    }


    await timer(5000);        // Wait for all the promisses (API Calls to finish)
    var flatArray = Array.prototype.concat(...resArray); // merge multiple arrays from multiple alls into one.
    console.log(catchArray);

// for (let i = 0; i < flatArray.length; i++) {

//     console.log(flatArray[i].starred_at);  
// }
//console.log(flatArray.length)
     
  
    console.log('----------------------------------------finsihed ---------------------------------------')
  
  
 
  
  
  return resArray
  
}

/// Timer function that puts delay between API Calls.
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
 }

 // Dividing API Calls into chunks.. - NOt being used currently
 function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
  }

  return tempArray;
}
 
// Exporting module so that other functions can call.
module.exports = {

getStarHistory:async function(reponame) {

  var start = new Date()
  const history = await getStarHistory(reponame,token)
    .catch(err => {
      console.log(err);
    });
    var end = new Date() - start
  console.info('Execution time: %dms', end) /// prints time taken by the function.
  return history;
  //console.log( history );
}

}