import { Template } from 'meteor/templating';
import './main.html';
import { Topics } from '../imports/api/topics.js';
/*Router Configuration*/
Router.configure({
layoutTemplate : 'basicTheme'
});
/*!Router Configuration*/
/*Index Route*/


Router.route('/' , {
  name : 'home',
  template : 'welcomeNote'
});
/*!Index Route*/
Router.route('/welcomeNote');


/*Register Route*/
Router.route('/register' , {
  name : 'register',
  template : 'register'
});
/*!Register Route*/

/*Register Route*/
Router.route('/login' , {
  name : 'login',
  template : 'login'
});
/*!Register Route*/

/*dashboard Route*/
Router.route('/dashboard' , {
  name : 'dashboard',
  template : 'dashboard'
});
/*!dashboard Route*/

Router.route('/topics/:_id' , {
  template : 'singleTopic',
  data : function(){
    var currentTopic = this.params._id;

    return Topics.findOne({_id : currentTopic});
  },
});

/*Creating Global helper*/

Template.registerHelper('timeSince' , (date) =>{
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
      return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";

});

/*!Global Helper */


/*Basic Theme Events*/

Template.basicTheme.events({
  'click .logout':function(event){
    event.preventDefault();
    Meteor.logout();

    Router.go('home');
  }
});
/*!Basic Theme Events*/

Template.welcomeNote.helpers({
  welcome(){
    return "Welcome guys";
  }
});
/*Dashboard*/
Template.dashboard.helpers({
  userName(){
      return Meteor.user().username;
  },
  topics(){
    return Topics.find({}, { sort: { createdAt: -1 } });
  }
});

Template.dashboard.events({

  'submit .topic-form' : function(event){
      event.preventDefault();
      var topicVar=event.target.topicMain.value;
      if(topicVar!='')
      {
        Topics.insert({
          topic : event.target.topicMain.value ,
          createdBy : Meteor.user().username ,
          createdAt : new Date(),
          likes : 0,
          comments :[]
        });
      }
    event.target.topicMain.value='';
  }
});
/*Template*/

/*Topic Template*/

/*!Topic Template*/

Template.register.events({
        'submit form': function(event) {
            event.preventDefault();
            var usernameVar=event.target.registerUserName.value;
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;
            Accounts.createUser({
            username: usernameVar,
            email: emailVar,
            password: passwordVar
          }, function(error){
            if(error){
              alert("There is a Error in Registration");
            }else{

              Router.go('dashboard');
            }
          });

        }
});


/*Login Template*/
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar,function(error){
          if(error){
              alert('error logging in');
          }else{

            Router.go('dashboard');
          }
        });

    }
});

Template.topic.helpers({


});
Template.topic.events({
  'click' : function(event){
    Router.go('/topics/'+this._id);
  },
});

Template.singleTopic.helpers({
 userName : function(){
   return Meteor.user().username;
 },
});


Template.singleTopic.events({

  'submit .comment-form' : function(event){
    event.preventDefault();
    var userCommentVar=event.target.userComment.value;
    var currentUser= Meteor.user().username;
    var commentTime=new Date();

    var commentDefination ={
      comment : userCommentVar ,
      user : currentUser,
      time : commentTime
    };


    var tempComments=Topics.findOne({_id : this._id}).comments;
    tempComments.push(commentDefination);
    Topics.update({_id:this._id} , {$set : { comments :tempComments}});
    event.target.userComment.value='';
  },

});
