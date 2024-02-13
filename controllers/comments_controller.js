const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailworker = require('../workers/comment_email_worker');

module.exports.create = async function(req,res){
  try{
    let post = await Post.findById(req.body.post);

    if(post){
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id
      });
      post.comments.push(comment);
      post.save();

      comment = await comment.populate('user','name email').execPopulate();
      // commentsMailer.newComment(comment);
      let job = queue.create('emails',comment).save(function(err){
        if(err){
          console.log('Error in sending to the queue',err);
          return;
        }
        console.log('job enqueued',job.id);
      });
      // let job = queueMicrotask.create('emails', comment).save(function(err){
      //   if(err){
      //     console.log('Error in creating a queue',err);
      //   }
      //   console.log(job.id);
      // });

      if(req.xhr){
        return res.status(200).json({
          data: {
            comment: comment
          },
          message: "Post created!"
        });
      }
      req.flash('success','Comment Published!');

      res.redirect('/');
    }
  }catch(err){
    req.flash('error',err);
    return;
  }
}


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
