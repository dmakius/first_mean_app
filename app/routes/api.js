var User = require('../models/user');

module.exports = function(router){
  router.post('/users', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == null || req.body.username == ''
    ||req.body.password == null ||req.body.password == ''
    ||req.body.email == null || req.body.password == ''){
        res.send('Ensure user, email, and password were provided');
        
    }else{
      user.save(function(err){
        if(err){
          res.send("Username or Email Already Exists!");
        }else{
          res.send('user created');
        }
      });
    }
  });

  router.get('/users', function(req, res){
    User.find({}, function(err,data){
      if(err)throw err;
      res.send(data);
    });
  });

  return router;
}
