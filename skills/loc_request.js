/*

Botkit Studio Skill module to enhance the "send location" script

*/



 function getLoc(x,y) {
    var coord = new coord(x, y);
    return coord;
  }

module.exports = function(controller) {
  var loc
  
 
   // listen for the phrase `shirt` and reply back with structured messages
  // containing images, links and action buttons
  controller.hears(['let\'s go!', 'leggo'],'message_received',function(bot, message) 
  {
    
    bot.createConversation(message, function(err, convo){
      convo.addQuestion({
        text:"Where are you?",
        quick_replies:[{
          "content_type":"location",
        }]
      }, function(response, convo){
        var obj = {
          lat: response.attachments[0].payload.coordinates.lat,
          lon: response.attachments[0].payload.coordinates.long
        }
        response.text = JSON.stringify(obj);
        convo.next();
      },{key: 'location'}, 'default');

      convo.activate();

      convo.on('end', function(convo) {
        
        if (convo.successful()) {
          var data = convo.extractResponses();
          data.location = JSON.parse(data.location);
          loc = {
            lat: data.location.lat,
            lon: data.location.lon
          }
          bot.reply(message, "You are at "+ loc.lat+ " " + loc.lon);
          
        }
        else {
          console.log("convo not sucessful");
        }
         console.log(loc.lat + " " + loc.lon);
      });
    });
  });
  
  
  
  
  
  
  
  
}
