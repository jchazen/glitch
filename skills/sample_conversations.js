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
      //while(!gotValidTime){
        if(sum++ < 10)
          console.log('In while loop');
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
        gotValidTime = (sum>100);
      //}
      console.log('Sum: ' + sum);
      // Bot requests AM or PM. If invalid input, it will request AMPM once more
      convo.ask('AM or PM?', function(response3, convo3){
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
        convo.say('Great, you want to meet up at ' + time + ampm + '!');
        convo.ask('What date do you want to meet up? (MM/DD/YYYY)', function(response4, convo4){
          console.log('  Inside date request');
          convo4.say('lmaos');
          convo4.next();
        });
        convo.next();
      };
    });
  });
  
  // This block listens for the strings "fruit" and "fruits"
  controller.hears(['fruit', 'fruits'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
      // Asks the user a question
      convo.ask('Which do you like the best out of apple, orange, and banana?', function(response1, convo1) {
        if(isEqual(response1.text, 'apple')){
          convo1.ask('An apple a day keeps the doctor away. Do you prefer apples as juice, pie, or the original fruit?', function(response2, convo2) {
            if(isEqual(response2.text, 'juice'))
              convo2.say('Ah, quite juicy.');
            else if(isEqual(response2.text, 'pie'))
              convo2.say('I guess we know what you\'re doing on March 14th.');
            else if(isEqual(response2.text, 'fruit'))
              convo2.say('You really don\'t want to see the doctor huh.');
            else
              convo2.say('I don\'t know what you said but if it\'s a variant of apples, sounds tasty enough for me!');
            convo2.next();
          });
        } else if(isEqual(response1.text, 'orange')){
          convo1.ask('The only fruit where the color is the fruit. What\'s your favorite brand of orange juice?', function(response2, convo2) {
            if(isEqual(response2.text, 'Tropicana') || isEqual(response2.text, 'Simply Orange'))
              convo2.say('Wow, I like ' + response2.text + ' too!');
            else
              convo2.say('I don\;t know that brand. I bet that ' + response2.text + ' orange juice tastes good though.');
          });
        } else if(isEqual(response1.text, 'banana')){
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