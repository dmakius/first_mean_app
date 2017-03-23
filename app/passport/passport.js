var FacebookStrategy  = require('passport-facebook').Strategy;
var User              = require('../models/user');
var session           = require('express-session');
var jwt               = require('jsonwebtoken');

module.exports = function(app, passport) {
  // Start Passport Configuration Settings
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({ secret: 'mamashchashuv', resave: false, saveUninitialized: true, cookie: { secure: false } }));

  // Serialize users once logged in
  passport.serializeUser(function(user, done) {
     token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
    done(null, user.id); // Return user object
  });

  // Deserialize Users once logged out
  passport.deserializeUser(function(id, done) {
         User.findById(id, function(err, user) {
             done(err, user); // Complete deserializeUser and return done
         });
  });

  passport.use(new FacebookStrategy({
             clientID: '245305935934697', // Replace with your Facebook Developer App client ID
             clientSecret: 'c02e72df80471cfe48cb255303607da9', // Replace with your Facebook Developer client secret
             callbackURL: "http://www.localhost:3000/auth/facebook/callback", // Replace with your Facebook Developer App callback URL
             profileFields: ['id', 'displayName', 'photos', 'email']
         },
         function(accessToken, refreshToken, profile, done) {
           console.log(profile);
             User.findOne({ email: profile._json.email }).select('username password email').exec(function(err, user) {
                 if (err) done(err);

                 if (user && user !== null) {
                     done(null, user);
                 } else {
                     done(err);
                 }
             });
         }
     ));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login' }), function(req, res) {
       res.redirect('/facebook/' + token); // Redirect user with newly assigned token
   });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

   return passport;

   ///URL Blocked: This redirect failed because the redirect URI
   //is not whitelisted in the app’s Client OAuth Settings.
   //Make sure Client and Web OAuth Login are on and add all your
   //app domains as Valid OAuth Redirect URIs.

}
