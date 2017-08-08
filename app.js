const methodOverride  = require('method-override'),
      LocalStrategy   = require('passport-local'),
      bodyParser      = require('body-parser'),
      passport        = require('passport'),
      mongoose        = require('mongoose'),
      request         = require('request'),
      express         = require('express'),
      app             = express()

//modulating the code
const Polls = require("./models/polls"),
      User  = require("./models/user")


//requring routes
const indexRoutes =require("./routes/index");
const pollsRoutes =require("./routes/polls");


//Passport Configuration
app.use(require("express-session")({
  secret: "______________",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=========================
var url = process.env.DATABASEURL || "mongodb://localhost/voting_app"
mongoose.connect(url);


app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(function(req, res, next){
  res.locals.currentUser = req.user
  next();
});

// app.use("/campgrounds", campgroundRoutesRoutes);
// app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/polls", pollsRoutes);

app.listen(3000, function() {
  console.log('Voting App on port 3000!')
});
