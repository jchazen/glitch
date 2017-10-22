/*

In this document, Botkit hears a keyword, then responds. Different paths
through the conversation are chosen based on the user's response.

*/

// CONVO VARS
var time = 'Not a time'; // stores the given time
var date = 'Not a date'; // stores the current date
var ampm = 'Not a morning person'; // stores morning or evening state
var occasion = 'A boring one'; // stores the formality level
const OCCASIONS = ['business', 'coffee', 'educational', 'family', 'food', 'meet up', 'night life', 'romantic', 'shopping', 'travel', 'other']; // list of occasions
// PERSON VARS
var lat = 0; // stores the latitude of the person
var lon = 0; // stores the longitude of the person
const AGREEMENTS = ['fill this out plz', 'yes', 'yeah', 'yea', 'y', 'mmhm']; // list of ways people can agree to something
var FRIENDS = []; // list of friends. empty on init
var friendsRSVP = 0; // number of friends who have RSVP'd
var PERSONS = []; // list of people going to meet up. independent of user
var person; // the current person
var targetFriend; // person who made the plan first
const RADIUS = 30; // number of miles away from targetFriend that google maps should search for places

// BEGINNING OF CONVO
module.exports = function(controller) {
  // Bot listens for "meet", then requests a time to meet up.
  // merge into "friends/group"
  controller.hears('meet', 'message_received', function(bot, message){
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
                  if(isEqualIgnoreCase(response5.text, 'yes') || isEqualIgnoreCase(response5.text, 'correct')){
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
  // merge into "friends/group"
  controller.hears('occasion', 'message_received', function(bot, message){
    bot.startConversation(message, function(err, convo){
      // Bot asks user for occasion. If user not sure, prompt 'other'
      convo.ask('Please specify the occasion and setting of your group meeting:', function(response1, convo1){
        for(var occ in OCCASIONS)
          if(isEqualIgnoreCase(occ, response1.text))
            occasion = response1.text;
        if(isEqual(occasion, 'A boring one'))
          occasion = 'other';
        convo1.say('You have chosen an occasion of ' + occasion + '. If this is correct, type \"friend\" or \"group\" to '
          + 'add other people to your plan. Otherwise, type \"occasion\" to choose another occasion.');
        convo1.next();
      });
      convo.next();
    });
  });
  
  // This block listens for the strings "fruit" and "fruits"
  controller.hears('fruit', 'message_received', function(bot, message) {
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

  // Bot listens for the string "find" and prompts the user to input the name of the person planning the event
  // Find is for non-meetup creators
  controller.hears('find', function(bot, message){
    bot.startConversation(message, function(err, convo){
      convo.ask('Which person created the plan?', function(response, convo1){
        if(friendsRSVP == FRIENDS.length){
          convo1.say('That group is full already.');
        } else {
          for(var i = 0; i < FRIENDS.length; i++){
            if(isEqualIgnoreCase(response.text, FRIENDS[i])){
              convo1.ask('You have selected ' + response.text + '\'s group. Join (and send location) or cancel?', new function(response2, convo2){
                if(isEqualIgnoreCase(response2.text, 'join')){
                  friendsRSVP++;
                  convo2.addQuestion({
                    text: "Could you send me your location please?", 
                    quick_replies:[{ "content_type": "location", }]
                  }, function(response, convo){
                    // location temporarily stores the lat/lon of the user
                    var location = {
                      lat: response.attachments[0].payload.coordinates.lat,
                      lon: response.attachments[0].payload.coordinates.long
                    };
                    person = makePerson(message.user.name, location.lat, location.lon);
                    console.log(message.user);
                    PERSONS.push(person);
                  });
                } else if(isEqualIgnoreCase(response2.text, 'cancel')){
                  convo2.say('Sorry to hear that. Have a good one!');
                  FRIENDS = removePerson(person, FRIENDS);
                } else
                  convo2.say('Unrecognized response. Please type \'find\' again to find your group, or \'meetup\' to create your own plan.');
                convo2.next();
              });
            }
          }
        }
        convo1.next();
      });
      convo.next();
    });
  });

  // Bot listens for the string "friend" or "group" and prompts the user to input a list of people separated by commas and spaces
  // Friends/Group is for meetup creators
  controller.hears(['friend', 'group'], function(bot, message){
    bot.startConversation(message, function(err, convo){
      // TODO: (later) fix how to add friends
      // Bot asks user to add friends/group members to the MeetUp plan
      convo.ask('Who would you like to meet up with? (separate names by a comma and space: \"John, Alexa, Gary\")', function(whoresp, whoconvo){
        FRIENDS = whoresp.split(', ');
        // need to message all friends who are in this plan: this needs subscription
        whoresp.next();
      });
      convo.addQuestion({
        text: "Could you send me your location please?", 
        quick_replies:[{ "content_type": "location", }]
      }, function(response, convo){
        // location temporarily stores the lat/lon of the user
        var location = {
          lat: response.attachments[0].payload.coordinates.lat,
          lon: response.attachments[0].payload.coordinates.long
        };
        person = makePerson(message.user.name, location.lat, location.lon);
        PERSONS.push(person);
      });
      // Determines whether a plan is full if both arrays are the same size
      function isPlanFull(PPL, FRNZ){
        return PPL.length == FRNZ.length + 1;
      }
      if(isPlanFull(PERSONS, FRIENDS)){
        // could use a for loop on this stuff
        var index = 0;
        while(index < PERSONS.length - 1){
          PERSONS[index].sum = findSum(PERSONS[index], PERSONS);
          index++;
        }
        targetFriend = findMinPerson(PERSONS);
        // TODO:  Send each person the map given the RADIUS and targetFriend
      }
    });
  });

  // TEST Bot listens for the string "friends" or "group" and prompts the user to input a list of people separated by commas and spaces
  controller.hears(['tests'], function(bot, message){
    bot.startConversation(message, function(err, convo){
      // Bot asks user to add friends/group members to the MeetUp plan
      convo.ask('Who would you like to meet up with? (separate names by a comma and space: \"John, Alexa, Gary\")', function(whoresp, whoconvo){
        FRIENDS = ['Jacob', 'Michael', 'Tiffany', 'Caitlyn'];
        whoresp.next();
      });
      convo.addQuestion({
        text: "Could you send me your location please?", 
        quick_replies:[{ "content_type": "location", }]
      }, function(response, convo){
        // location temporarily stores the lat/lon of the user
        var location = {
          lat: response.attachments[0].payload.coordinates.lat,
          lon: response.attachments[0].payload.coordinates.long
        };
        person = makePerson(message.user.name, location.lat, location.lon);
        PERSONS = makeFakePersons();
        PERSONS.push(person);
      });
      /*
      var index = 0;
      while(index < PERSONS.length - 1){
        PERSONS[index].sum = findSum(PERSONS[index], PERSONS);
        index++;
      }
      */
      targetFriend = findMinPerson(PERSONS);
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
  });

  // listen for the phrase `shirt` and reply back with structured messages
  // containing images, links and action buttons
  controller.hears(['let\'s go!', 'leggo'], 'message_received', function(bot, message){
    //start conversation after hearing key word
    bot.startConversation(message, function(err, convo){
      convo.addQuestion({
        text: 'Where are you?',
        quick_replies: [{ 'content_type': 'location' }] // Asks user to send location
      }, function(response, convo){
        //parsing latitude and longitude based on user location
        var obj = {
          lat: response.attachments[0].payload.coordinates.lat,
          lon: response.attachments[0].payload.coordinates.long
        }
        console.log('Looks like user ' + message.user + ' is at: '+ JSON.stringify(obj));
        //if message.user found in file, delete
        var o = db.get(message.user)
        if(o !== null) db.delete(message.user);
        //writing data to json file
        db.save(message.user, JSON.stringify(obj));
        
        bot.reply(message, 'You are at ' + obj.lat + ', ' + obj.lon);
        bot.reply(message, 'Let's explore!')
        
      },{key: 'location'}, 'default');
    });
  });
}

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
function isNumber(str){ return !isNaN(parseInt(str)); }

// A function that tests if the given string is a letter
function isLetter(str) { return str.length === 1 && str.match(/[a-z]/i); }

// A function that tests if two strings are equal
function isEqual(str1, str2){ return str1 == str2; }

// A function that tests if two String objects are equal
function isEqualIgnoreCase(str1, str2){ return str1.toUpperCase() == str2.toUpperCase(); }

// ALL OF THE BELOW CODE DEFINES THE PERSON SPECS

//module.exports = function(controller){};
/*
var Person = {
  name: "", // The name of the person
  sum: 0, // The aggregate distance between this person and everyone else
  lat: null, // Latitude
  lon: null // Longitude
}
*/

// Returns the linear distance between p1 and p2
function linDistance(p1, p2){
  var phi1 = p1.lat, theta1 = p1.long, phi2 = p2.lat, theta2 = p2.long;
  var distance = Math.sqrt(Math.pow(Math.cos(theta1)*Math.sin(phi1)-Math.cos(theta2)*Math.sin(phi2),2)
    + Math.pow(Math.sin(theta1)*Math.sin(phi1)-Math.sin(theta2)*Math.sin(phi2),2)
    + Math.pow(Math.cos(phi1)-Math.cos(phi2),2)
  );
  return distance;
}

// Returns which person has the smaller sum
function smallerSum(p1, p2){
  if(p1.sum < p2.sum)
    return p1;
  else
    return p2;
}

// PERSON CONSTRUCTOR
function makePerson(named, latd, longd){
  return {
    name: named,
    sum: 0,
    lat: latd,
    long: longd
  };
};

// Returns the aggregate sum of distances between the target and group
function findSum(target, group){
  var sum;
  for (var other in group) {
    if(!(other.equals(target))){
        sum += target.linDistance(target, other);
    }
  }
  return sum;
};

// Returns the person with the smallest sum in the group and sorts group in ascending order
function findMinPerson(group){
  var position = 0;
  var minPerson = group[0];
  var index = 0;
  for(position = 0; position < group.length - 1; position++){
    var minSum = group[position].sum;
    for(index = position; index < group.length - 1; ){
      if(group[index].sum + 1 < group[position].sum){
        minPerson = group[index + 1];
        group[index + 1] = group[position];
        group[position] = minPerson;
        index = position;
      }
      else index++;
    };
  };
  return minPerson;
};

// Returns an array without the person that was just removed
function removePerson(name, group){
  var temp = group[0];
  for(var i = 1; i < group.length; i++){
    if(isEqual(group[i], name)){
      group[i] = temp;
      group[0] = name;
    }
  }
  group.shift();
  return group;
}

// Returns whether the two persons are the same
function equals(p1, p2){
  if(p1.name == p2.name && p1.long == p2.long && p2.lat == p2.lat)
    return true;
  return false;
}

// TESTING PURPOSES ONLY: Creates a fully initialized dummy person array
function makeFakePersons(){
  return {
    p1: {
      name: 'Jacob',
      sum: 2.1, //0.8+0.3+1.0,
      lat: 32.881794,
      lon: -117.233410
    },
    p2: {
      name: 'Michael',
      sum: 2.7, //1.0+0.7+1.0,
      lat: 32.873969,
      lon: -117.242955
    },
    p3: {
      name: 'Tiffany',
      sum: 1.7, //0.7+0.3+0.7,
      lat: 32.881122,
      lon: -117.237604
    },
    p4: {
      name: 'Caitlyn',
      sum: 2.5, //1.0+0.8+0.7,
      lat: 32.886089, 
      lon: -117.242760
    }
  };
}