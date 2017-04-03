var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt-nodejs');

var nameValidator = [
  validate({
    validator:'matches',
    //makes sure that allnames are in format: Firstname Lastname
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zAiZ]{3,20})+)+$/,
    message:"Name must be atleast 3 characters, max 30, no special characters, must have a space between name"
  }),
  validate({
    validator:'isLength',
    arguments:[3,25],
    message:"name should be between {ARGS[0]} and {ARGS[1]} characters"
  })
];
var emailValidator = [
  validate({
    validator:'isEmail',
    //makes sure that allnames are in format: Firstname Lastname
    message:"is not a valid email"
  }),
  validate({
    validator:'isLength',
    arguments:[3,25],
    message:"Email should be between {ARGS[0]} and {ARGS[1]} characters"
  })
];
var usernameValidator = [
  validate({
    validator:'isLength',
    arguments:[3,25],
    message:"username should be between {ARGS[0]} and {ARGS[1]} characters"
  }),
  validate({
    validator:'isAlphanumeric',
    message:"Username must contain letters and numbers ONLY"
  })
];

var passwordValidator = [
  validate({
    validator:'matches',
    //makes sure that allnames are in format: Firstname Lastname
    arguments:/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message:"Password must containt one lowercase, one number characters, one special symbol, at least 8 characters, and no moe than 35"
  }),
  validate({
    validator:'isLength',
    arguments:[8,35],
    message:"password should be between {ARGS[0]} and {ARGS[1]} characters"
  })
];

var UserSchema = new Schema({
  name:{type:String, lowercase:true, required:true, validate:nameValidator},
  username:{ type: String, lowercase: true, required: true, unique: true,validate:usernameValidator},
  password: { type: String, required: true, validate:passwordValidator, select: false},
  email: { type: String, required: true, lowercase: true, unique: true, validate:emailValidator},
  active:{type: Boolean, required:true, default:false},
  temporaryToken:{type: String, requried:true},
  resetToken:{type:String, requried:false},
  permission:{type:String, required:true, default:'admin'}
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    // Function to encrypt password
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) return next();
        user.password = hash;
        next();
    });
});
//makes all names in database lowercase for consistancy
UserSchema.plugin(titlize,{
  paths:['name'],
})

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
