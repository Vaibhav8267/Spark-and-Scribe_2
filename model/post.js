const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  description: String,
  image: {
    url:String,
    filename:String,
  },
  content: String,
  category: String,

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  comments: [
    {
      content: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
