/*

In this document, Botkit hears a keyword, then responds. Different paths
through the conversation are chosen based on the user's response.

*/

module.exports = function(controller) {
  // Bot listens for "meet". Then requests a time to meet up.
  controller.hears(['meet', 'meeting'], 'message_received', function(bot, message){
    var gotValidTime = false; // Stores whether a valid time was input
    var gotValidAMPM = false; // Stores whether a valid am/pm has been input
    bot.startConversation(message, function(err, convo){
      var time = 'Not a time'; // stores the given time
      var date = 'MM/DD/YYYY'; // stores the current date
      var ampm = 'Not a morning person'; // stores morning or evening state
      console.log('  Before asking time');
      // Bot requests time to meet up. If time is not correctly formatted, it will request the time once more
      while(!gotValidTime){
        convo.ask('What time?', function(response2, convo2){
          console.log('  Before if statement');
          if(followsTimeFormat(response2.text, '12:60')
            || (isNumber(response2.text) && parseInt(response2.text) <= 12 && parseInt(response2.text) >= 0)){
            time = response2.text;
            gotValidTime = true;
            console.log('  If statement true, time is valid: ' + time);
          } else {
            console.log('  Error: ' + response2.text + ' is not a valid time');
            convo2.say('Uh oh, that\'s not a valid time! Type \"meet\" again to re-plan.');
          }
          console.log('  Got to this point: exited if statement');
          convo2.next();
        });
      }
      // Bot requests AM or PM. If invalid input, it will request AMPM once more
      convo2.ask('AM or PM?', function(response3, convo3){
        if(isEqual(response3.text, 'PM'))
          ampm = 'PM';
        else if(isEqual(response3.text, 'AM'))
          ampm = 'AM';
        else{
          convo3.say('Invalid time setting. Automatically setting AM...');
          ampm = 'AM';
        }
        console.log('ampm: ' + ampm);
        convo3.next();
      });
      // Bot requests date if AMPM is correct. If invalid input, it will request date once more
      if(isEqual(ampm, 'AM') || isEqual(ampm, 'PM')){
        convo2.say('Great, you want to meet up at ' + time + ampm + '!');
        convo2.ask('What date do you want to meet up? (MM/DD/YYYY)', function(response4, convo4){
          console.log('  Inside date request');
          convo4.say('lmaos');
          convo4.next();
        });
        convo.next();
      };
    });
  });
  
  // A function that checks if the string follows a time format.
  // The colon : is the delimiter. The string must have a colon separating integers.
  function followsTimeFormat(str, formatStr){
    var strs = str.split(':'), formatStrs = str.split(':');
    if(strs.length != formatStrs.length)
      return false;
    for(var i = 0; i < strs.length; i++)
      if(parseInt(strs[i]) > parseInt(formatStrs[i]))
        return false;
    return true;
  }

  // A function that tests if the given string is a number
  function isNumber(str){
    return !isNaN(parseInt(str));
  }

  // A function that tests if the given string is a letter
  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  // A function that tests if two strings are equal
  function isEqual(str1, str2){
    return str1 == str2;
  }
  
};