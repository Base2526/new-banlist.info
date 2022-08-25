import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  displayName: { type: String },
  roles: [{ type: String }],
  isActive: { type: String },
  image :[{
    base64: { type: String },
    fileName: { type: String },
    size: { type: Number },
    type: { type: String },
    
    lastModified: { type: Date },
    
  }],
  lastAccess : { type : Date, default: Date.now },
  isOnline: {type: Boolean, default: false}
},
{
    timestamps: true
})


const User = mongoose.model('user', userSchema,'user')
export default User