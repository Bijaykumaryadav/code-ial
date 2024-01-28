const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = function (req, res) {
  // console.log(req.cookies);
  // res.cookie("User_id", 25);

  // Post.find({}).then((posts) => {
  //   res.render("home", {
  //     title: "Codeial | Home",
  //     posts: posts,
  //   });
  // })
  // .catch(err => {
  //   //Handle error
  //   console.error(err);
  //   //Respond with an error
  //   res.status(500).send("Internal Server Error");
  // });
  //populate the user of each post
Post.find({})
  .populate("user")
  .populate({
    path: "comments",
    populate: {
      path: "user",
    },
  })
  .exec()
  .then((posts) => {
    // Once posts are fetched and populated, find all users
    return User.find({})
      .exec() // Return a promise chain
      .then((users) => {
        // Once users are fetched, render the home view
        res.render("home", {
          title: "Codeial | Home",
          posts: posts,
          all_users: users,
        });
      });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
  });

};
