import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.ObjectId, ref: 'Group' },
  updated: Date,
  enrolled: {
    type: Date,
    default: Date.now
  },
  student: { type: mongoose.Schema.ObjectId, ref: 'User' },
  labStatus: [{
    lab: { type: mongoose.Schema.ObjectId, ref: 'Lab' },
    complete: Boolean
  }],
  completed: Date,
  code: {
    type: String,
    minlength: 6,
    maxlength: 6,
  }
})

EnrollmentSchema.index({student: 1, group: 1}, {unique: true})

export default mongoose.model('Enrollment', EnrollmentSchema)
