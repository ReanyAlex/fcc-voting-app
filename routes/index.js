const passport    = require('passport'),
      express     = require("express"),
      router      = express.Router(),
      User        = require("../models/user")
      

//Index routes

//route route
router.get('/', function(req, res) {
  res.redirect('/polls')
});

router.get('/register', function(req, res) {
  res.render('register')
});

router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      return res.redirect("/register")
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/");
    })
  })
});

router.get('/login', function(req, res) {
  res.render("login");
});
//using passport middleware
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    failureRedirect: "/login"
  }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
  req.logout()
  res.redirect("/");
})

module.exports = router
