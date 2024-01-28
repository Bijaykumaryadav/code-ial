const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  Post.create({
    content: req.body.content,
    user: req.user._id,
  })
    .then((post) => {
      return res.redirect("back");
    })
    .catch((err) => {
      console.log("error in creating a post", err);
      //Handle the error or send an error response
      return res.status(500).send("Error in creating a post");
    });
};

// module.exports.destroy = function (req, res) {
//   Post.findById(req.params.id, function (err, post) {
//     //./Id means converting the object id into srting
//     if (post.user == req.user.id) {
//       post.remove();
//       Comment.deleteMany({ post: req.params.id }, function (err) {
//         return res.redirect("back");
//       });
//     } else {
//       return res.redirect("back");
//     }
//   });
// };
module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.user.toString() === req.user.id) {
      await Post.deleteOne({ _id: post._id }); // Assuming 'deleteOne' is the appropriate method for your schema
      await Comment.deleteMany({ post: req.params.id });
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error in destroying post:", error);
    return res.status(500).send("Error in destroying post");
  }
};

