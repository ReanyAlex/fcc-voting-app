//To hold middleware
const Polls  = require("../models/polls")
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }else {
    res.redirect("/login")
  }
}

middlewareObj.checkPollOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Polls.findById(req.params.id, function(err, foundPoll) {
      if (err) {
        res.redirect("back")
      }else {
        //these are not the same foundPoll.author.id  req.user._id one is a string the other a mongoose object
        // .equals() mongoose method to compare the different types values
        if (foundPoll.author.id.equals(req.user._id)) {
          next();
        }else {
          res.redirect("back")
        }
      }
    })
  }else {
    //takes user back to where they came from
    res.redirect("back")
  }
}

module.exports = middlewareObj
