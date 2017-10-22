var yelp = require('yelp-fusion');
const clientId = process.env.YELP_CLIENT_ID;
const clientSecret = process.env.YELP_CLIENT_SECRET;






function yelpsearch(string){
var searchRequest = {
  latitude:'3',
  longitude:'2'
};
yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);
  
    client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
    });
  
  }).catch(e => {
  console.log(e);
});
  
}
