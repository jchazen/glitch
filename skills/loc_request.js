/*

Botkit Studio Skill module to enhance the "send location" script
NEW?



//var database = new Store('./my-folder/dataBB.json');

module.exports = function(controller) {
  
var Store = require("jfs");
var db = new Store("./my-folder/datab.json");

  
   // listen for the phrase `shirt` and reply back with structured messages
  // containing images, links and action buttons
  controller.hears(['let\'s go!', 'leggo'],'message_received',function(bot, message) 
  {
    //start conversation after hearing key word
    bot.startConversation(message, function(err, convo){
      convo.addQuestion({
        text:"Where are you?",
        quick_replies:[{
          "content_type":"location",      // asks user to send location
        }]
      }, function(response, convo){
         
        //parsing latitude and longitude based on user location
        var obj = {
          lat: response.attachments[0].payload.coordinates.lat,
          lon: response.attachments[0].payload.coordinates.long
        }
        console.log("Looks like user " + message.user + " is at: "+ JSON.stringify(obj));

        //if message.user found in file, delete
        var o = db.get(message.user)
        if(o !== null) db.delete(message.user);
        //writing data to json file
        db.save(message.user, JSON.stringify(obj));
        
        bot.reply(message, "You are at "+ obj.lat + " " +obj.lon);
        bot.reply(message, "Let's explore!")
        
      },{key: 'location'}, 'default');

    });
    
  });

};
*/