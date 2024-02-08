const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  return res.status(200).json({
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // if (post.user.toString() === req.user.id) {
      await Post.deleteOne({ _id: post._id }); // Assuming 'deleteOne' is the appropriate method for your schema
      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
        message: "Posts and associated comments deleted successfully"
      });
    // } else {
    //   req.flash("error", "you cannot delete this Post!");
    //   return res.redirect("back");
    // }
  } catch (error) {
    return res.status(500,{
      message: "Internal Server Error"
    });
  }
};