var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "mamashchashuv";
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package


module.exports = function(router){
     var client = nodemailer.createTransport({
         service: 'Zoho',
         auth: {
             user: 'cruiserweights@zoho.com', // Your email address
             pass: 'PAssword123!@#' // Your password
         },
         tls: { rejectUnauthorized: false }
     });
  //USER REGISTRATION
  router.post('/users', function(req, res){
    //create new user object for db
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
    user.temporaryToken = jwt.sign({username:user.username, email: user.email}, secret, {expiresIn: '14h'});
    //check that all fields are present
    if(req.body.username == null || req.body.username == ''
    || req.body.password == null || req.body.password == ''
    || req.body.email == null || req.body.email == ''
    || req.body.name == null || req.body.name == ''){
        res.json({success:false,message: "Ensure user, email, and password were provided"})
    }else{
    //if all fields present save new user to db
    user.save(function(err){
        //If there is an Error
      if(err){
            //if there is a validation error
          if(err.errors != null){
            console.log("validation error");
            if(err.errors.name){
                res.json({success:false, message:err.errors.name.message});
            }else if(err.errors.email){
                res.json({success:false, message:err.errors.email.message});
            }else if(err.errors.username){
                res.json({success:false, message:err.errors.username.message});
            }else if(err.errors.password){
                res.json({success:false, message:err.errors.password.message});
            }else{
              res.json({success:false, message:err});
            }
        //if there is NOT a validation error, is duplicate in database
        }else if(err){
          console.log("duplication error");
          res.json({success:false, message:err});
          if(err.code == 11000){
            if(err.errmsg[61] == "u"){
              res.json({success:false, message:"Username is already taken"});
            }else if(err.errmsg[61] == "e"){
              console.log("email duplication error");
                res.json({success:false, message:"Email is already taken"});
            }
          }
        }
    //if there is NO error
  }else{
    // Create e-mail object to send to user
    var email = {
        from: 'MEAN Stack Staff, cruiserweights@zoho.com',
        to: user.email,
        subject: 'localhost Activation',
        text: "Hello" + user.name + "Thank you for registering at localhost.com. Please click on the link below to complete your activation:",
        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://www.localhost:3000/activate/' + user.temporaryToken + '">http://www.localhost:3000/activate/</a>'
      };
    // Function to send e-mail to the user
    client.sendMail(email, function(err, info) {
        if (err) {
          console.log(err); // If error with sending e-mail, log to console/terminal
        } else {
          console.log(info); // Log success message to console if sent
          console.log(user.email); // Display e-mail that it was sent to
        }
    });

      res.json({success:true, message:"Account registered! Please check your email to activate"  });
    }
  });//end saving user to db
  }
});

  router.post('/authenticate', function(req, res){
    var loginUser =(req.body.username).toLowerCase();
    User.findOne({username:loginUser}).select("email username password active")
    .exec(function(err, user){
      if(err)throw err;
      if(!user){
        res.json({success:false, message:"Could NOT authenticate user"});
      }else if(user){
        if(req.body.password){
          var validPassword = user.comparePassword(req.body.password);
        }else{
          res.json({success:false, message:"No Password Provided"});
        }
        if(!validPassword){
          res.json({success:false, message:"Could NOT authenticate password"});
        }else if(!user.active){
          res.json({success:false, message:"Account NOT activated. Please check your email"})
        }else{
          var token = jwt.sign({username:user.username, email: user.email}, secret, {expiresIn: '14h'});
          res.json({success:true, message:"User Authorized!", token:token});
        }
      }
    });
  });

  router.put('/activate/:token', function(req, res){
    User.findOne({temporaryToken: req.params.token}, function(err, user){
      if(err)throw err;
      var token = req.params.token;
      jwt.verify(token, secret, function(err, decoded){
        console.log(decoded);
        if(err){
          res.json({success:false, message:"Activtion link has expired"});
        }else if(!user){
          res.json({success:false, message:"USER DOESNT EXIST OR Activtion link has expired"});
        }else{
          user.temporaryToken = false;
          user.active = true;
          user.save(function(err){
            if(err){
              console.log(err);
            }else{
              var email = {
                  from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                  to: user.email,
                  subject: 'localhost Activation',
                  text: "Hello" + user.name + "Your account has been sucessfully activated",
                  html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been sucessfully activated'
                };
              // Function to send e-mail to the user
              client.sendMail(email, function(err, info) {
                  if (err) {
                    console.log(err); // If error with sending e-mail, log to console/terminal
                  } else {
                    console.log(info); // Log success message to console if sent
                    console.log(user.email); // Display e-mail that it was sent to
                  }
              });
                res.json({success:true, message:"Account Activated"});
            }

          });
        }
    })
  })
});
    //check fro username
    router.post('/checkusername', function(req, res){
      User.findOne({username:req.body.username}).select("username")
      .exec(function(err, user){
        if(err)throw err;
        if(user){
          res.json({success:false, message:"that username is already taken"});
        }else{
          res.json({success:false, message:"Username is Valid"});
        }
      });
    });
    //check email
    router.post('/checkemail', function(req, res){
      User.findOne({email:req.body.email}).select("email")
      .exec(function(err, user){
        if(err)throw err;
        if(user){
          res.json({success:false, message:"that email is already taken"});
        }else{
          res.json({success:false, message:"Email is Valid"});
        }
      });
    });

  //middle ware for checking tokens
  router.use(function(req, res, next){
      console.log("middleware token decoding working");
    var token = req.body.token|| req.body.query || req.headers['x-access-token'];
    console.log("token:" + token);
    if(token){
      jwt.verify(token, secret, function(err, decoded){
        if(err){
          res.json({success:false, message:"Token Invalid"});
        }else{
          req.decoded = decoded;
          next();
        }
      });
    }else{
      res.json({success:false, message:"No Token provided"});
    }
  });

  router.post('/me', function(req, res){
    res.send(req.decoded);
  });

  router.get('/users', function(req, res){
    User.find({}, function(err,data){
      if(err)throw err;
      res.send(data);
    });
  });

  return router;
}
