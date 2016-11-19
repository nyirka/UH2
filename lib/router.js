Router.configure({
    layoutTemplate: 'layout',
    //waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.route('description', {name: 'description'});
Router.route('quiz', {name: 'quiz'});
Router.route('itemUI', {name: 'itemUI'});
Router.route('BTaskUI', {name: 'BTaskUI'});

Router.route('main', {
    path: '/',
    template: 'description'
});