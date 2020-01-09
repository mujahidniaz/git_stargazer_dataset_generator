const axios = require('axios');
const sampleNum = 15;
let waitTime=200;

const token = '4d5235a5cbc0c47688da990461694a04518a2bcc';
let resArray=[];
let catchArray=[];


// return [1,2, ..., n]
const range = n => Array.apply(null, {length: n}).map((_, i) => i + 1);
//console.log(range);
/**
 * get star history
 * @param {String} repo - eg: 'timqian/jsCodeStructure'
 * @param {String} token - github access token
 * @return {Array} history - eg: [{date: 2015-3-1,starNum: 12}, ...]
 */
 async function getStarHistory(repo, token) {
  const axiosGit = axios.create({
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
    },
    // params: {
    //   access_token: token
    // },
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
    //console.log(initRes);
   
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

    if(pageNum>100)
    {
      waitTime=1000;
    }
    
    
    const pageIndexes = Array.from({length: pageNum}, (v, k) => k+1); 
    
    console.log('test'+ pageNum);
    
    
   const sampleUrls = pageIndexes.map(pageIndex => `${initUrl1}?page=${pageIndex}`+ '&access_token='+ token +'&per_page=100');
    console.log(sampleUrls);
    console.log("pageIndexes", pageIndexes);
    return { firstPage: initRes, sampleUrls, pageIndexes };
  }

  const { sampleUrls, pageIndexes, firstPage } = await generateUrls(repo);

  
let paginArray =  chunkArray(sampleUrls,150)

    for (let i = 0; i < sampleUrls.length; i++) {
      console.log(i);
      
      axiosGit.get(sampleUrls[i])
          .then((response) => {

            
           // console.log(response.data[0]);
            response.data.forEach(element => {
              let currdata = {repo_name:repo,user:"",starred_at:""};
             currdata.starred_at= element.starred_at;
             currdata.user=element.user.login;
             resArray.push(currdata);
            });
            
          }).catch(error => {
            console.log(error);
            catchArray.push(sampleUrls[i]);
          })
      
      await timer(waitTime); // then the created Promise can be awaited
    }


    await timer(5000);
    var flatArray = Array.prototype.concat(...resArray);
    console.log(catchArray);

// for (let i = 0; i < flatArray.length; i++) {

//     console.log(flatArray[i].starred_at);  
// }
//console.log(flatArray.length)
     
  
    console.log('----------------------------------------finsihed ---------------------------------------')
  
  
 
  
  
  return resArray
  
}


function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
 }

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
 

module.exports = {

getStarHistory:async function(reponame) {

  var start = new Date()
  const history = await getStarHistory(reponame,token)
    .catch(err => {
      console.log(err);
    });
    var end = new Date() - start
  console.info('Execution time: %dms', end)
  return history;
  //console.log( history );
}

}