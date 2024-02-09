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

    // Check if post.user exists before accessing its properties
    if (post.user && post.user.toString() === req.user.id) {
      await Post.deleteOne({ _id: post._id });
      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
        message: "Post and associated comments deleted successfully",
      });
    } else {
      return res.status(401).json({
        message: "You cannot delete this post!",
      });
    }
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

