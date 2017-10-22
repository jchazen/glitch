var GoogleMapsAPI = require('googlemaps');
var gmAPI = new GoogleMapsAPI();
//var params = {lat, lon}
module.exports = function(controller) 
{
  controller.hears('place','message_received', function(bot, message) 
  {
    bot.reply(message,
    {   text:"MeetUp here!",
        quick_replies:[{
          "content_type": application/json
          "https://www.google.com/maps/search/movie+theaters/@28.354177,-81.6731525,11z/data=!3m1!4b1",      // asks user to send location
        }]
      })
    })
  };
"Content-Type: application/json" -d '{
  "recipient": {
    "id": "<PSID>"
  },
  "message": {
    "text": "hello, world!"
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token=<PAGE_ACCESS_TOKEN>"