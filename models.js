'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema
({
  user:
  {
    firstName: String,
    lastName:  String,
    userName: String,
     email:   String,
  //  password: {type: String, required:true}
    password: String
  },
  created: {type: Date, default: Date.now}
});

const recipeSchema = mongoose.Schema
({
    userName : String,
    recipeName: String,
    ingredients :{},
    rating: String,
    created: {type: Date, default: Date.now}
})

recipeSchema.methods.serialize = function()
{
  return{
      userName : this.userName,
      recipeName: this.recipeName,
      ingredients : this.ingredients,
      rating : this.rating
    }
}

userSchema.methods.serialize = function()
{
  return{
       userName : this.user.userName ,
       firstName : this.user.firstName ,
       lastName: this.user.lastName
  }
}

userSchema.methods.validatePassword = function(password) {
  console.log('In models.js:'+password);
  return bcrypt.compare(password, this.user.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const recipes = mongoose.model('recipes', recipeSchema);
const users = mongoose.model('users',userSchema);

module.exports = {recipes,users};
