var yelp = require('yelp-fusion');
const clientId = process.env.YELP_CLIENT_ID;
const clientSecret = process.env.YELP_CLIENT_SECRET;

yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);
  
  // fill in function here
  
  
  }).catch(e => {
  console.log(e);
});
