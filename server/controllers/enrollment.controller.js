import Enrollment from '../models/enrollment.model'
import errorHandler from './../helpers/dbErrorHandler'
import User from '../models/user.model'

const create = async (req, res) => {
  let newEnrollment = {
    group: req.group,
    student: req.auth,
  }
  newEnrollment.labStatus = req.group.labs.map((lab) => {
    return { lab: lab, complete: false }
  })
  const enrollment = new Enrollment(newEnrollment)
  try {
    let result = await enrollment.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const join = async (req, res) => {
  let newEnrollment = {
    group: req.group,
    student: req.auth,
    code: req.params.code
  }
  newEnrollment.labStatus = req.group.labs.map((lab) => {
    return { lab: lab, complete: false }
  })
  const enrollment = new Enrollment(newEnrollment)
  try {
    let result = await enrollment.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getStudents = async (req, res) => {
  try {

    const groupId = req.params.groupId;
    const enrollments = await Enrollment.find({ group: groupId })
    const userIds = enrollments.map((enrollment) => enrollment.student);

    const UserPromises = userIds.map(async (userId) => {
      const user = await User.findById(userId).select('name email');
      return user;
    });
    const UsersData = await Promise.all(UserPromises)

    res.json(UsersData);
  }
  catch (err) {
    console.error(err);
    return res.status('400').json({
      error: "Enrollment not found"
    })
  }
}


/**
 * Load enrollment and append to req.
 */


const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: 'group', populate: { path: 'instructor' } })
      .populate('student', '_id name')
    if (!enrollment)
      return res.status('400').json({
        error: "Enrollment not found"
      })
    req.enrollment = enrollment
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve enrollment"
    })
  }
}

const read = (req, res) => {
  return res.json(req.enrollment)
}

const complete = async (req, res) => {
  let updatedData = {}
  updatedData['labStatus.$.complete'] = req.body.complete
  updatedData.updated = Date.now()
  if (req.body.groupCompleted)
    updatedData.completed = req.body.groupCompleted

  try {
    let enrollment = await Enrollment.updateOne({ 'labStatus._id': req.body.labStatusId }, { '$set': updatedData })
    res.json(enrollment)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment
    let deletedEnrollment = await enrollment.remove()
    res.json(deletedEnrollment)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeall = async (req, res) => {
  try {
    let group = req.group
    let deletedGroup = await Enrollment.deleteMany({ group: group._id })
    // res.json(deletedGroup)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth._id == req.enrollment.student._id
  if (!isStudent) {
    return res.status('403').json({
      error: "User is not enrolled"
    })
  }
  next()
}

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ student: req.auth._id }).sort({ 'completed': 1 }).populate('group', '_id name category')
    res.json(enrollments)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({ group: req.group._id, student: req.auth._id })
    if (enrollments.length == 0) {
      next()
    } else {
      res.json(enrollments[0])
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const enrollmentStats = async (req, res) => {
  try {
    let stats = {}
    stats.totalEnrolled = await Enrollment.find({ group: req.group._id }).countDocuments()
    stats.totalCompleted = await Enrollment.find({ group: req.group._id }).exists('completed', true).countDocuments()
    res.json(stats)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}



export default {
  create,
  enrollmentByID,
  read,
  remove,
  removeall,
  complete,
  isStudent,
  listEnrolled,
  findEnrollment,
  enrollmentStats,
  join,
  getStudents
}
