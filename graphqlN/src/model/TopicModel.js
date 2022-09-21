import mongoose from 'mongoose';
const Schema = mongoose.Schema
const topicSchema = new Schema({
  name: { type: String },
  description: { type: String },
  isPublish: { type: Number}
},
{
    timestamps: true
})

const topic = mongoose.model('topic', topicSchema, 'topic')
export default topic