import mongoose from 'mongoose'

const LabSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String
})
const Lab = mongoose.model('Lab', LabSchema)
const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
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
  labs: [LabSchema]
})

export default mongoose.model('Group', GroupSchema)
