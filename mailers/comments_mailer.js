const nodemailer = require("../config/nodemailer");

//this is a another way of exporting a method
exports.newComment = (comment) => {
  console.log("inside new comment mailer", comment);

  nodemailer.transporter.sendMail(
    {
      from: "carry9224@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published",
      html: "<h1>Yup, Your comment is now published </h1>",
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending the mail", err);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};
