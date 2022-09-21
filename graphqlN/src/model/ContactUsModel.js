import mongoose from 'mongoose';

const Schema = mongoose.Schema

var File = new Schema({
  url: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  encoding: { type: String },
})

const contactUsSchema = new Schema({
  nameSurname: { type: String },
  email: { type: String },
  tel: { type: String },
  topic: { type: String },
  description: { type: String },
  attackFiles: [File]
},
{
    timestamps: true
})


const ContactUs = mongoose.model('contactUs', contactUsSchema,'contactUs')
export default ContactUs