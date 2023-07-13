import mongoose from 'mongoose'

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
    trim: true, 
    required: 'Description is required',
    min: 5,
    max: 400
  },
  // category: {
  //   type: String,
  //   required: 'Category is required'
  // },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  instructor: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'User',
    required: 'Instructor is required'
   },
  published: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    minlength: 6,
    maxlength: 6,
    unique: true,
    required: true
  },
  labs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Lab'
    }
  ],
  students: [
    {
      type:mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  dueDate: {
    type: Date,
    default: new Date(Date.now()+ (60 * 60 * 1000))
  },
});


export default mongoose.model('Group', GroupSchema);
