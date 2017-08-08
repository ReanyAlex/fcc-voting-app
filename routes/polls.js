const Polls       = require("../models/polls")
      express     = require("express"),
      router      = express.Router(),
      User        = require("../models/user"),
      middleware  = require("../middleware")


router.get('/', function(req, res) {
  //get the from DB
  Polls.find({}, function(err, allPolls) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        polls: allPolls,
        currentUser: req.user
      });
    }
  })
});

router.post('/', function(req, res) {
  console.log(req.body);
  let title = req.body.title
  let description = req.body.description
  let choices = req.body.choices.split(',')
  let values = function(){
    let array = []
    for (var i = 0; i < choices.length; i++) {
      array.push(0)
    }
    return array
  }
  let author = {
    id: req.user._id,
    username: req.user.username
  }

  let newPoll = {
    title:title,
    description:description,
    choices: {
      choices:choices,
      values:values()
    },
    author: author
  }

  Polls.create(newPoll, function(err, newlyCreated) {
    if (err) {
      console.log("there has been an error");
      console.log(err);
    } else {
      console.log("new polll has been added");
    }
  })

  console.log(newPoll);
  res.redirect("/")
});

router.get('/new', middleware.isLoggedIn,  function(req, res) {
  res.render("polls/new");
});

router.get('/:id', function(req, res) {
  Polls.findById(req.params.id).exec(function(err, foundPoll){
    if (err) {
      console.log(err);
    }else {
      res.render("polls/show", {poll: foundPoll})
    }
  })
});

//Edit Route
router.get("/:id/edit", function(req, res) {
  Polls.findById(req.params.id, function(err, foundPoll) {
    res.render("polls/edit", {poll: foundPoll});
  });
});
//Update Route

router.put("/:id/", function(req, res) {
  Polls.findByIdAndUpdate(req.params.id, req.body.poll, function(err, updatedPoll) {
    if (err) {
      res.redirect("/polls")
    }else {
      res.redirect("/polls/" + req.params.id)
    }
  })
});

//Delete router

router.delete("/:id", function(req, res) {
  Polls.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/polls");
    }else {
      res.redirect("/polls");
    }
  })
})

router.get("/:id/edit/vote/:index", function(req, res) {
  //callback function for multiple findby&update

  let index = +req.params.index
  console.log('index', index);

  function callback(err, updatedPoll) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/polls/${req.params.id}`);
    }
  }
  //to get the infomation from the server to be able to change what is updated "" or strikethrough
  Polls.findById(req.params.id, function(err, poll) {
    if (err) {
      console.log(err);
    } else {
      console.log('vote',poll);
      poll.choices.values[index]=+poll.choices.values[index]+1;
      console.log('updated',poll.choices);
      Polls.findByIdAndUpdate(req.params.id, { choices: poll.choices }, callback);

    }
  })
});

module.exports = router
