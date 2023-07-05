import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
  group: {type: mongoose.Schema.ObjectId, ref: 'Group'},
  updated: Date,
  enrolled: {
    type: Date,
    default: Date.now
  },
  student: {type: mongoose.Schema.ObjectId, ref: 'User'},
  labStatus: [{
      lab: {type: mongoose.Schema.ObjectId, ref: 'Lab'}, 
      complete: Boolean}],
  completed: Date
})

export default mongoose.model('Enrollment', EnrollmentSchema)
