const Comment = require("../models/comment");
const Post = require("../models/post");

// module.exports.create = function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             },function(err,comment){
//                 //handle error

//                 post.comments.push(comment);
//                 post.save();

// res.redirect('/');
//             });
//         }
//     });
// }
module.exports.create = function (req, res) {
  Post.findById(req.body.post)
    .then((post) => {
      if (post) {
        return Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        }).then((comment) => {
          req.flash("success","Comments Added Successfully");
          post.comments.push(comment);
          return post.save();
        });
      } else {
        req.flash("error","Post not Found");
        throw new Error("Post not found");
      }
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      req.flash('error',err);
      res.status(500).send("Error creating comment: " + err.message);
    });
};

// module.exports.destroy = function(req,res){
//     Comment.findById(req.params.id , function(err,comment){
//         if(comment.user == req.user.id){
//             let postId = comment.post;
//             comment.remove();

//             Post.findByIdAndUpdate(postId , { $pull: { comments: req.params.id}},function(err,post){
//                 return redirect('back');
//             })
//         }
//         else{
//             return redirect('back');
//         }
//     });
// }

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    if (comment.user == req.user.id) {
      let postId = comment.post;
      req.flash("success","Comments deleted Successfully!");
      await comment.deleteOne(); // Replace remove() with deleteOne()

      const post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      if (post) {
        return res.redirect("back");
      } else {
        throw new Error("Post not found");
      }
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    req.flash('error',err);
    console.error("Error in destroying comment:", error);
    return res.redirect("back");
  }
};
