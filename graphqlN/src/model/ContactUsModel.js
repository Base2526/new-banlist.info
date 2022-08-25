const mongoose = require("mongoose");

const ContactUsModel = new mongoose.Schema(
  {
    postId: String,
    categoryId: String,
    userId: String,
    description: String
  },
  {
    timestamps: true,
  }
);

const ContactUs = mongoose.model("contactUs", ContactUsModel, "contactUs");
export default ContactUs

