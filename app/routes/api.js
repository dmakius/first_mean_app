var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "mamashchashuv";
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package


module.exports = function(router){
  //DEFINE EMAIL CLIENT
     var client = nodemailer.createTransport({
         service: 'zoho',
         auth: {
             user: 'cruiserweights@zoho.com', // Your email address
             pass: 'PAssword123!@#' // Your password
         },
         tls: { rejectUnauthorized: false }
     });
//Register and Create an Account
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

//login to account
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
          res.json({success:false, message:"Account NOT activated. Please check your email", expired: true})
        }else{
          var token = jwt.sign({username:user.username, email: user.email}, secret, {expiresIn: '6hr'});
          res.json({success:true, message:"User Authorized!", token:token});
        }
      }
    });
});
//resend activation email - AUTHENTICATE REQUEST
router.post('/resend', function(req, res){
    User.findOne({username:req.body.username}).select("email username password active")
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
        }else if(user.active){
          res.json({success:false, message:"Account is ALREADY Activated" , expired: true})
        }else{
          res.json({success: true, user:user});
        }
      }
    });
  });
//RESEND ACTIVATION EMAIL - SEND EMAIL
router.put('/resend', function(req, res){
    User.findOne({username: req.body.username}).select("username name email temporaryToken")
    .exec(function(err, user){
      if(err)throw err;
      user.temporaryToken = jwt.sign({username:user.username, email: user.email}, secret, { expiresIn: '14h'});
      user.save(function(err){
        if(err){
          console.log(err);
        }else{
          var email = {
              from: 'MEAN Stack Staff, cruiserweights@zoho.com',
              to: user.email,
              subject: 'localhost Reactivation REquest',
              text: "Hello" + user.name + "You recently requested for registering at localhost.com. Please click on the link below to complete your activation:",
              html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://www.localhost:3000/activate/' + user.temporaryToken + '">http://www.localhost:3000/activate/</a>'
            };
          // Function to send e-mail to the user
          client.sendMail(email, function(err, info) {
              if (err) {
                console.log(err); // If error with sending e-mail, log to console/terminal
              } else {
                console.log("messag sent: " + info.response); // Log success message to console if sent

              }
          });
          res.json({success:true, message:"Activation Link has been resent to " + user.email});
        }
      })
    })
});
//ACTIVATE ACCOUNT
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
              // var email = {
              //     from: 'MEAN Stack Staff, cruiserweights@zoho.com',
              //     to: user.email,
              //     subject: 'localhost Activation',
              //     text: "Hello" + user.name + "Your account has been sucessfully activated",
              //     html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been sucessfully activated'
              //   };
              // // Function to send e-mail to the user
              // client.sendMail(email, function(err, info) {
              //     if (err) {
              //       console.log(err); // If error with sending e-mail, log to console/terminal
              //     } else {
              //       console.log(info); // Log success message to console if sent
              //       console.log(user.email); // Display e-mail that it was sent to
              //     }
              // });
                res.json({success:true, message:"Account Activated"});
            }
          });
        }
    })
  })
});
//SENDING ACCOUNT USERNAME - AUTHENTICATE ACCOUNT
router.get('/resetusername/:email', function(req, res){
    User.findOne({email:req.params.email}).select().exec(function(err, user){
      if(err){
        res.json({success: false, message: err});
      }else{
        if(!req.params.email){
          res.json({success:false, message:"no email was provided"});
        }else{
          if(!user){
            res.json({success:false, message:"email was not found"});
          }else{
            //START send email
            var email = {
                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                to: user.email,
                subject: 'localhost Request Username',
                text: "Hello" + user.name + ". Your username is: " + user.username,
                html: 'Hello<strong> ' + user.name + '</strong>,<br><br> Your username is: <strong>'+ user.username + '</strong>'
              };
            // Function to send e-mail to the user
            client.sendMail(email, function(err, info) {
                if (err) {
                  console.log(err); // If error with sending e-mail, log to console/terminal
                } else {
                  console.log("messag sent: " + info.response); // Log success message to console if sent
                }
            });
            //END send email
            res.json({success:true, message:"username has been sent to emial: " + user.email})
          }
        }
      }
    })
});
//RESETING PASSWORD
router.put('/resetpassword', function(req, res){
    console.log("SENDING TO SERVER: " + req.body.username);
    User.findOne({username:req.body.username}).select("username email resetToken name active").exec(function(err, user){
      console.log("RESULTS: " + user);
      if(err) throw err;
      if(!user){
        res.json({succes:false, message:"username was not found :-P"});
      }else if(!user.active){
        res.json({succes:false, message:"Account is not activated"});
      }else{
          user.resetToken = jwt.sign({username:user.username, email: user.email}, secret, { expiresIn: '14h'});
          user.save(function(err){
            if(err){
              rs.json({succes:false, message:err});
            }else{
              // //START -reset password email
              // var email = {
              //     from: 'MEAN Stack Staff, cruiserweights@zoho.com',
              //     to: user.email,
              //     subject: 'localhost Reset Password request',
              //     text: "Hello" + user.name + "You have recently requested a reset p[assword link",
              //     html: 'Hello<strong> ' + user.name + '</strong>,<br><br> You have recently requested a to reset your password.<br>Please click on the following link:'
              //     + '<a href=http://localhost:3000/reset/'+ user.resetToken + '>Reset Password</a>'
              //   };
              // // Function to send e-mail to the user
              // client.sendMail(email, function(err, info) {
              //     if (err) {
              //       console.log(err); // If error with sending e-mail, log to console/terminal
              //     } else {
              //       console.log(info); // Log success message to console if sent
              //       console.log(user.email); // Display e-mail that it was sent to
              //     }
              // });
              // //END -reset password email
              res.json({success:true, message:"Please check your email for a reset password link :-)"});
            }
          })
      }
    });
});
//get the user
router.get('/resetpassword/:token', function(req, res){
  User.findOne({resetToken: req.params.token}).select().exec(function(err, user){
    if(err)throw err;
    var token = req.params.token;
    jwt.verify(token, secret, function(err, decoded){
      console.log(decoded);
      if(err){
        res.json({success:false, message:"Password reset link has expired"});
      }else{
        if(!user){
          res.json({success:false, user: "password link has expired"});
        }else{
            res.json({success:true, user: user});
        }
      }
    })
  })
});
//CHANGE PASSWORD
router.put('/changepassword', function(req, res){
  console.log("LOGGIND REQ DATA");
  console.log(req.body);
  User.findOne({username: req.body.username}).select('username name password email resetToken').exec(function(err, user){
    if(err) throw err;
    if(req.body.password == null || req.body.password == ''){
      res.json({success:false, message: "Password not provided"});
    }else{
      user.password = req.body.password;
      user.resetToken = false;
      user.save(function(err){
        if(err){
          res.json({success:"false", message: err});
        }else{
          //START - password succesgully reset
          // var email = {
          //     from: 'MEAN Stack Staff, cruiserweights@zoho.com',
          //     to: user.email,
          //     subject: 'localhost Reset Password request',
          //     text: "Hello" + user.name + ", Your password has succesfully been reset",
          //     html: 'Hello<strong> ' + user.name + ', Your password has succesfully been reset'
          //   };
          // // Function to send e-mail to the user
          // client.sendMail(email, function(err, info) {
          //     if (err) {
          //       console.log(err); // If error with sending e-mail, log to console/terminal
          //     } else {
          //       console.log(info); // Log success message to console if sent
          //       console.log(user.email); // Display e-mail that it was sent to
          //     }
          // });
        }
      })
    }
  })
});
//check for username
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

////////////////////////////////////////////////////////////////////////////////////////////////////
//middle ware for authenticated requests (needs to check tokens)
router.use(function(req, res, next){
    console.log("route is using MIDDLE WARE");
    console.log("Exectuing middleware from: "  + req.url);
    var token = req.body.token|| req.body.query || req.headers['x-access-token'];
    console.log("token:" + token);
    if(token){
      jwt.verify(token, secret, function(err, decoded){
        if(err){
          res.json({success:false, message:"Token Invalid"});
        }else{
          req.decoded = decoded;
          next(); //next() allows the server to continue past the middleware
        }
      });
    }else{
      res.json({success:false, message:"No Token provided , SUCK MY BALLS!"});
    }
  });
////////////////////////////////////////////////////////////////////////
//POST MIDDLEWARE ROUTES
////////////////////////////////////////////////////////////////////////
router.get('/renewtoken/:username', function(req,res){
    User.findOne({username:req.params.username}).select().exec(function(err, user){
      if(err) throw err;
      if(!user){
        res.json({success: false, message: "no user was found"});
      }else{
        var token =  jwt.sign({username:user.username, email: user.email}, secret, { expiresIn: '1m'});
        res.json({success:true, token: newtoken});
      }
    })
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

router.get('/permission', function(req, res){
  User.findOne({username: req.decoded.username}, function(err, user){
    if(err) throw err;
    if(!user){
      res.json({success: false, message:"No User was Found"});
    }else{
      res.json({success: true, message:"permission found!" ,permission: user.permission});
    }
  });
});

router.get('/management', function(req, res){
  //query the dtabase for all users
    User.find({}, function(err, users){
      if(err) throw err;
      //query the data for the user logged in
      User.findOne({username:req.decoded.username}, function(err, mainUser){
        if(err) throw err;
        if(!mainUser){
          res.json({success:false, message: "No User found"});
        }else{
          console.log("main user permission FOUND: " + mainUser.permission);
          if(mainUser.permission === 'admin' || mainUser.permission === "moderator"){
            console.log("MAIN USERs PERMISSIONS GRANTED");
            if(!users){
              res.json({success:false, message:"NO Users found"});
            }else{
              res.json({success:true, users:users, permission: mainUser.permission});
            }
          }else{
            res.json({success:false, message:"Insufficient Permissions :-("});
          }
        }
      })
    });
});

router.delete('/management/deleteUser/:username', function(req, res){
  var deletedUser = req.params.username;
  console.log("deleting: " + deletedUser);
  User.findOne({username:req.decoded.username}, function(err, mainUser){
    if(err) throw err;
    if(!mainUser){
      res.json({success: false, message: "noe user found"});
    }else{
      if(mainUser.permission != "admin"){
        res.json({success: false, message:"Insufficient Permissions"});
      }else{
        User.findOneAndRemove({username:deletedUser}, function(err, user){
          if(err) throw err;
          res.json({success: true});
        })
      }
    }
  })
});

router.get('/edit/:id', function(req, res){
  var editUser = req.params.id;
  User.findOne({username: req.decoded.username}, function(err, mainUser){
    if(err) throw err;
    if(!mainUser){
      res.json({success:false, message:"No user found"});
    }else{
      if(mainUser.permission === 'admin' ||mainUser.permission == 'moderator'){
          User.findOne({_id:editUser}, function(err, user){
            if(err) throw err;
            if(!user){
              res.json({success: false, message: "No user found"});
            }else{
              res.json({success: true, user: user});
            }
          });
      }else{
        res.json({success:false, message:"Insifficient Permissions"});
      }
    }
  })
});

router.put('/edit/', function(req, res){
  console.log(req.body);
  //store user being edited in vaiable
  var editUser = req.body._id;

  // create viariables for changed values
  if(req.body.name) var newName = req.body.name;
  if(req.body.username) var newUsername = req.body.username;
  if(req.body.email) var newEmail = req.body.email;
  if(req.body.permission) var newPermission = req.body.permission;

  console.log("name changed to: " + newName);
  console.log("email changed to: " + newEmail);
  console.log("username changed to: " + newUsername);

  // get logged in user andcheck their permissions
  User.findOne({username: req.decoded.username}, function(err, mainUser){
      if(err) throw err;
      if(!mainUser){
        res.json({message: false, message:"No User found"});
      }else{
        // The main user exists, NOW, WHCAT TO DO FOR CHANGES////
        //updating name
        if(newName){
          //MAIN USER MUST BE ADMIN OR MODERATOR
          if(mainUser.permission === 'admin' ||mainUser.permission === 'moderator'){
            //SELECTE EDIT USER FROM DATABASE
            User.findOne({_id: editUser}, function(err, user){
              if(err) throw err;
              if(!user){
                res.json({success: false, message:"No User Found"});
              }else{
                //CHANGE THE USER'S NAME IN DATABASE AND SAVE
                user.name = newName;
                user.save(function(err){
                  if(err){
                    console.log(err);
                  }else{
                    res.json({success: true, message:"Name has been updated"});
                  }
                });
              }
            });
          }
          else{
            res.json({success: false, message:"Insufficient Permissions"});
          }
        }
      //updating username
      if(newUsername){
          if(mainUser.permission === 'admin' ||mainUser.permission === 'moderator'){
            User.findOne({_id: editUser}, function(err, user){
              if(err) throw err;
              if(!user){
                res.json({success: false, message: "No User Found"});
              }else{
                user.username = newUsername;
                user.save(function(err){
                  if(err){
                    console.log(err);
                  }else{
                    res.json({success: true, message: "Username has been updated"});
                  }
                });
              }
            });
        }else{
            res.json({success: false, message:"Insufficient Permissions"});
        }
      }
      //new email
      if(newEmail){
          if(mainUser.permission === 'admin' ||mainUser.permission === 'moderator'){
            User.findOne({_id: editUser}, function(err, user){
              if(err) throw err;
              if(!user){
                res.json({success: false, message: "No User Found"});
              }else{
                user.email = newEmail;
                user.save(function(err){
                  if(err){
                    console.log(err);
                  }else{
                    res.json({success: true, message: "Email has been updated"});
                  }
                });
              }
            });
          }else{
            res.json({success: false, message:"Insufficient Permissions"});
          }
      }
      //

      if(newPermission){
        if(mainUser.permission === 'admin' ||mainUser.permission === 'moderator'){
          //look up user to edit in database
          User.findOne({_id: editUser}, function(err, user){
            if(err) throw err;
            if(!user){
              res.json({success: false, message: "No User Found"});
            }else{
              //CASE 1 - changing edit user to user ie downgrading a user
              if(newPermission == "user"){
                  // editusers current permission is admin - ONLY OTHER ADMIN can downgrade them.
                  if(user.permission === 'admin'){
                    if(mainUser.permission != 'admin'){
                      res.json({success: false, message: "Insifficient permission. You must be and admin to downgrade an admin user"});
                    }else{
                    //change edit user's permission on database
                    user.permission = newPermission;
                    user.save(function(err){
                      if(err){
                        console.log(err);
                      }else{
                          res.json({success: true, message: "Permissions have been updated"});
                      }
                    });
                  }
                //EDITUser's permission is not ADMIN
                }else{
                    user.permission = newPermission;
                    user.save(function(err){
                      if(err){
                        console.log(err);
                      }else{
                          res.json({success: true, message: "The User's Permissions have been updated"});
                      }
                    });
                }
              }
              //CASE 2 -  EDIT USER BECOMES A MODERATOR
              if(newPermission === 'moderator'){
                if(user.permission == 'admin'){
                  if(mainUser.permission !== 'admin'){
                    res.json({success: false, message:"Insifficient permission. You must be at least an admin to downgrade an admin user"});
                  }else{
                    user.permission = newPermission;
                    user.save(function(err){
                      if(err){
                        console.log(err);
                      }else{
                          res.json({success: true, message: "Permissions have been updated"});
                      }
                    });
                  }
                }else{
                  user.permission = newPermission;
                  user.save(function(err){
                    if(err){
                      console.log(err);
                    }else{
                        res.json({success: true, message: "Permissions have been updated"});
                    }
                  });
                }
              }
              //CASE 3 - EDIT USER BECOMES AN ADMIN
              if(newPermission === 'admin'){
                if(mainUser.permission === 'admin'){
                  user.permission = newPermission;
                  user.save(function(err){
                    if(err){
                      console.log(err);
                    }else{
                        res.json({success: true, message: "Permissions have been updated"});
                    }
                  });
                }else{
                  res.json({success: false, message:"Insifficient permission. You must be at least an admin to upgrade another user to the admin level"});
                }
              }
            }
          });
        }else{
          res.json({success: false, message:"Insufficient Permissions"});
       }
      }
    }//end ELSE for main user permission
  });//end QUERY for main user
});//enf ROUTE
  return router;
}
