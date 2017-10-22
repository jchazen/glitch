/*

In this document, Botkit hears a keyword, then responds. Different paths
through the conversation are chosen based on the user's response.

*/
var sum = 0;

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
        if(sum++ < 100)
          console.log('  Entered while loop.' + su);
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
      // Bot requests AM or PM
      convo.next();
    });
  });

  // Bot listens for "meet". Then requests a time to meet up.
  controller.hears(['meet', 'meeting'], 'message_received', function(bot, message){
    var gotValidTime = false; // Stores whether a valid time was input
    var time = 'Not a time'; // stores the given time
    var date = 'MM/DD/YYYY'; // stores the current date
    var ampm = 'Not a morning person'; // stores morning or evening state
    // Bot requests time to meet up. If time is not correctly formatted, it will request the time once more
    bot.createConversation(message, function(err, convo){
      convo.addMessage({ text: 'Uh oh, that\'s not a valid time! Please re-enter the time:' }, 'time_fail');
      convo.addMessage({ text: 'Time set at ' + time }, 'time_success');
      convo.addMessage({ text: 'Incorrect.', action: 'default' }, 'bad_response');

      convo.ask('What time?', [
        { pattern: 'derp', callback: function(response, convo)
          { time = response.text; convo.gotoThread('time_success'); }
        },
        { pattern: 'dun', callback: function(response, convo)
          { convo.gotoThread('time_failure'); }
        },
        { default: true, callback: function(response, convo)
          { convo.gotoThread('bad_response'); }
        }
      ]);/*
      console.log('  Before asking time');
      convo.ask('What time?', function(response, convo){
        console.log('  Before if statement');
        if(followsTimeFormat(response2.text, '12:60')
          || (isNumber(response.text) && parseInt(response.text) <= 12 && parseInt(response.text) >= 0)){
          time = response.text;
          console.log('  If statement true, time is valid: ' + time);
        } else {
          console.log('  Error: ' + response.text + ' is not a valid time');
          convo.say('Uh oh, that\'s not a valid time! Type \"meet\" again to re-plan.');
        }
        console.log('  Got to this point: exited if statement');
        convo.next();
      });*/

      convo.activate();

      convo.on('end', function(convo){
        if(convo.successful()){
          bot.reply(message, 'Got a valid time!');
        }
      })
    });
    /*
    // Bot requests AM or PM. If invalid input, it will request it once more
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
    if(isEqual(ampm, 'AM') || isEqual(ampm, 'PM')){
      convo2.say('Great, you want to meet up at ' + time + ampm + '!');
      convo2.ask('What date do you want to meet up? (MM/DD/YYYY)', function(response4, convo4){
        console.log('  Inside date request');
        convo4.say('lmaos');
        convo4.next();
      });
    }*/
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