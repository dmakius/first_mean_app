var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "mamashchashuv";

module.exports = function(router){
  //USER REGISTRATION
  router.post('/users', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == null || req.body.username == ''
    || req.body.password == null || req.body.password == ''
    || req.body.email == null || req.body.email == ''){
        res.json({success:false,message: "Ensure user, email, and password were provided"})
    }else{
      user.save(function(err){
        if(err){
          res.json({success:false, message:"Username or Email Already Exists!"});
        }else{
          res.json({success:true, message:"user created"  });
        }
      });
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

  router.use(function(res, req, next){
    var token = req.body.token|| req.body.query || req.headers['x-access-token'];
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
