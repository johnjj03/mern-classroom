import mongoose from 'mongoose'

const LabSchema = new mongoose.Schema({
  title: {
      type: String,
      required: 'Title is required',
  },

  content: {
      type: String,
      required: 'Content is required',
  },
  resource_url: {
      type: String,
      required: 'Resource URL is required',       
  }
})

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: 'Name is required'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: 'Category is required'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  instructor: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  code : {
    type: String,
    minlength: 6,
    maxlength: 6,
    unique: true,
  },
  labs: [LabSchema]
});


export default mongoose.model('Group', GroupSchema);
