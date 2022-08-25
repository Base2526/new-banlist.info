import mongoose from 'mongoose';
const Schema = mongoose.Schema
const tContactUsSchema = new Schema({
  name: { type: String },
  description: { type: String },
  isPublish: { type: Number}
},
{
    timestamps: true
})

const tContactUs = mongoose.model('tContactUs', tContactUsSchema,'tContactUs')
export default tContactUs