
module.exports = function(controller) {
  controller.hears(['place'],['message_received'], function(bot, message) {
    bot.reply(message, {
      attachment: {
        'type':'template',
        'payload': {
          'template_type':'generic',
          'elements': [{
            'title':'MeetUp here!',
            'image_url':'http://www.jqueryscript.net/images/Show-Nearby-Places-jQuery-Google-Maps-WhatsNearby.jpg',
            'buttons': [{
              'type':'web_url',
              'url':'https://www.google.com/maps/search/movie+theaters/@28.354177,-81.6731525,11z/data=!3m1!4b1',
              'title':'View Map'
            }]
          }]
        }
      }
    });
  });
}