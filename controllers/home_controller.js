const Post = require("../models/post");

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
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .exec()
    .then((posts) => {
      // console.log(posts);
      res.render("home", {
        title: "Codeial | Home",
        posts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
