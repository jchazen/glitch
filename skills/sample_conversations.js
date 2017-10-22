/*

In this document, Botkit hears a keyword, then responds. Different paths
through the conversation are chosen based on the user's response.

*/
var time = 'Not a time'; // stores the given time
var date = 'Not a date'; // stores the current date
var ampm = 'Not a morning person'; // stores morning or evening state
var occasion = 'A boring one'; // stores the formality level
const OCCASIONS = ['business', 'coffee', 'educational', 'family', 'food', 'night life', 'romantic', 'shopping', 'travel', 'other']; // list of occasions

module.exports = function(controller) {
  // Bot listens for "meet", then requests a time to meet up.
  controller.hears(['meet', 'meeting'], 'message_received', function(bot, message){
    bot.startConversation(message, function(err, convo){
      console.log('  Before asking time');
      // Bot requests time to meet up. If time is not correctly formatted, it will request the time once more
      convo.ask('What time?', function(response2, convo2){
        console.log('  Before if statement');
        // COMPARES response2.text to determine time
        if(followsTimeFormat(response2.text, '12:60') || (isNumber(response2.text) && parseInt(response2.text) <= 12 && parseInt(response2.text) >= 0)){
          time = response2.text;
          console.log('  TIME If statement true, time is valid: ' + time);
          // Bot requests AM or PM. If invalid input, it will request AMPM once more
          convo2.ask('AM or PM?', function(response3, convo3){
            // COMPARES response3.text to determine AMPM setting
            if(isEqualIgnoreCase(response3.text, 'PM'))
              ampm = 'PM';
            else if(isEqualIgnoreCase(response3.text, 'AM'))
              ampm = 'AM';
            else{
              convo3.say('Invalid time setting. Automatically setting to AM...');
              ampm = 'AM';
            }
            console.log('  AMPM: ' + ampm);
            // Bot requests date if AMPM is correct. If invalid input, it will request date once more
            if(isEqualIgnoreCase(ampm, 'AM') || isEqualIgnoreCase(ampm, 'PM')){
              convo3.ask('What date do you want to meet up? (MM/DD/YYYY)', function(response4, convo4){
                console.log('  Inside date request');
                // COMPARES response4.text to determine date
                if(followsDateFormat(response4.text, '12/31/9999')){
                  date = response4.text;
                  console.log('  DATE If statement true, date is valid: ' + date);
                } else {
                  convo4.say()
                }
                // Bot asks user if inputted information is correct. If not, redo; if so, 
                convo4.ask('Ok. So you want to meet on ' + date + ' at ' + time + ampm + '. Is this correct?', function(response5, convo5){
                  // COMPARES response5.text as "yes" or "no" to determine if location should be sent
                  if(response5.text == 'yes'){
                    convo5.say('Great! I\'ll let you know which places you and your group should meet at soon!' +
                      'Type \'occasion\' to specify the type of location you want to go to.');
                    // location shit
                  } else
                    convo5.say('Oh no! Type \'meet\' again to re-plan your session.');
                  convo5.next();
                });
                convo4.next();
              });
            };
            convo3.next();
          });
        }
        convo2.next();
      });
      convo.next();
    });
  });

  // Bot listens for the string "occasion" and sets the occasion of the event
  controller.hears('occasion', 'message_received', function(bot, message){
    bot.startConversation(message, function(err, convo){
      // Bot asks user for occasion. If user not sure, prompt 'other'
      convo.ask('Please specify the occasion and setting of your group meeting. (formal/informal):', function(response1, convo1){
        for(var occ in OCCASIONS)
          if(isEqualIgnoreCase(occ, response1.text))
            occasion = response1.text;
        if(isEqual(occasion, 'A boring one'))
          occasion = 'other';
        convo1.say('You have chosen an occasion of ' + occasion + '. If this is correct, type \"lmao\", otherwise type \"occasion\".');
        convo1.next();
      });
      convo.next();
    });
  });
  
  // This block listens for the strings "fruit" and "fruits"
  controller.hears(['fruit', 'fruits'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
      // Asks the user a question
      convo.ask('Which do you like the best out of apple, orange, and banana?', function(response1, convo1) {
        if(isEqualIgnoreCase(response1.text, 'apple')){
          convo1.ask('An apple a day keeps the doctor away. Do you prefer apples as juice, pie, or the original fruit?', function(response2, convo2) {
            if(isEqualIgnoreCase(response2.text, 'juice'))
              convo2.say('Ah, quite juicy.');
            else if(isEqualIgnoreCase(response2.text, 'pie'))
              convo2.say('I guess we know what you\'re doing on March 14th.');
            else if(isEqualIgnoreCase(response2.text, 'fruit'))
              convo2.say('You really don\'t want to see the doctor huh.');
            else
              convo2.say('I don\'t know what you said but if it\'s a variant of apples, sounds tasty enough for me!');
            convo2.next();
          });
        } else if(isEqualIgnoreCase(response1.text, 'orange')){
          convo1.ask('The only fruit where the color is the fruit. What\'s your favorite brand of orange juice?', function(response2, convo2) {
            if(isEqualIgnoreCase(response2.text, 'Tropicana') || isEqualIgnoreCase(response2.text, 'Simply Orange'))
              convo2.say('Wow, I like ' + response2.text + ' too!');
            else
              convo2.say('I don\;t know that brand. I bet that ' + response2.text + ' orange juice tastes good though.');
            convo2.next();
          });
        } else if(isEqualIgnoreCase(response1.text, 'banana')){
          convo1.say('BANANAS. GOOD CHOICE.');
        } else{
          convo1.say('You\'re avoiding the question.');
        }
        convo1.next();
      });
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

  // A function that checks if the string follows a date format.
  // The slash / is the delimiter. The string must have two slashes separating integers.
  function followsDateFormat(str, formatStr){
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

  // A function that tests if two String objects are equal
  function isEqualIgnoreCase(str1, str2){
    return str1.toUpperCase() == str2.toUpperCase();
  }
};
