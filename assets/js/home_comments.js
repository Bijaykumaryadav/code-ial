{
  // Method to submit the form data for new comment using AJAX
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
          $("#post-comments-" + data.data.comment.post).append(newComment);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Method to create a comment in DOM
  let newCommentDom = function (comment) {
    return $(`<li id="comment-${comment._id}">
              <p>
                  <small>
                  <a class="delete-comment-button" href="/comments/destroy/${comment._id}">x</a>
                  </small>
                  ${comment.content}
                  <br />
                  <small>
                  ${comment.user.name}
                  </small>
              </p>
            </li>`);
  };

  // Method to delete a comment from DOM
  let deleteComment = function () {
    $(document).on("click", ".delete-comment-button", function (e) {
      e.preventDefault();
      let deleteLink = $(this);
      $.ajax({
        type: "get",
        url: deleteLink.prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Call the functions to initialize
  createComment();
  deleteComment();
}
