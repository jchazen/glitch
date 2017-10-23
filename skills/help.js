module.exports = function(controller) {


    // This before middleware allows the help command to accept sub-thread names as a parameter
    // so users can say help to get the default thread, but help <subthread> will automatically
    // jump to that subthread (if it exists)
    controller.studio.before('help', function(convo, next) {

        // is there a parameter on the help command?
        // if so, change topic.
        if (matches = convo.source_message.text.match(/^help (.*)/i)) {
            if (convo.hasThread(matches[1])) {
                convo.gotoThread(matches[1]);
            }
        } else {
            convo.say('New user? Forgot how to talk to me? Here are some things that might jog your memory: \n' +
                'Ask me to \"meet\" if you want to plan a group meeting! \n' +
                'Tell me about a \"fruit\"! \n' +
                'Want to \"find\" your friend\'s group meeting? \n' +
                'Need to confirm your location? Then \"let\'s go\"! \n' +
                'Just want to say \"hello\"?');
        }

        next();

    });

}
