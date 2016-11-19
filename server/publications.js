Meteor.publish('mainText', function() {
    return mainText.find();
});

Meteor.publish('marked', function() {
    return marked.find();
});
