var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "mamashchashuv";

module.exports = function(router){
  //USER REGISTRATION
  router.post('/users', function(req, res){
    //create new user object for db
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
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
          res.json({success:true, message:"user created"  });
        }
  });//end saving user to db
  }
});

  router.post('/authenticate', function(req, res){
    User.findOne({username:req.body.username}).select("email username password")
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
        }else{
          var token = jwt.sign({username:user.username, email: user.email}, secret, {expiresIn: '14h'});
          res.json({success:true, message:"User Authorized!", token:token});
        }
      }
    });
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
