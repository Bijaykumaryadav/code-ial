{
  //Method to submit the form data for new comment using AJAX
  let createComment = function () {
    let newCommentForm = $("#new-comment-form");
    newCommentForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: newCommentForm.serialize(),
        success: function (data) {
          console.log(data);
          let newComment = newCommentDom(data.data.comment);
          $(`#post-comments-${data.data.comment.post}`).append(newComment);
        },
        error: function (error) {
          console.log(error.responeText);
        },
      });
    });
  };
  //Method to create a comment in DOM
  let newCommentDom = function (comment) {
    return $(`<li>${comment.content}</li>`);
  };
  createComment();
}
