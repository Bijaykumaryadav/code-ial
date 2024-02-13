const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
    },
    //this defines the object od of the like object
    likeable: {
      type: mongoose.Schema.ObjectId,
      require: true,
      refPath: "onModel",
    },
    //this field is used for defining the type of the liked object since this is a dyanamic reference
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
