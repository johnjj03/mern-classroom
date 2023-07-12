import Group from '../models/group.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.png'
import Enrollment from '../models/enrollment.model'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let group = new Group(fields)
    group.instructor = req.profile

    //Generating a random string for the group code
    group.code = Math.random().toString(36).substring(2, 8)
    group.code = group.code.toUpperCase()

    if (files.image) {
      group.image.data = fs.readFileSync(files.image.path)
      group.image.contentType = files.image.type
    }
    try {
      let result = await group.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load group and append to req.
 */
const groupByID = async (req, res, next, id) => {
  try {
    let group = await Group.findById(id).populate('instructor', '_id name')
    if (!group)
      return res.status('400').json({
        error: "Group not found"
      })
    req.group = group
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve group"
    })
  }
}

const groupByCode = async (req, res, next, code) => {
  try {
    let group = await Group.findOne({ code: code }).populate('instructor', '_id name')
    if (!group)
      return res.status('400').json({
        error: "Group not found"
      })
    req.group = group
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve group"
    })
  }
}


const read = (req, res) => {
  req.group.image = undefined
  return res.json(req.group)
}

const list = async (req, res) => {
  try {
    let groups = await Group.find().select('name email updated created')
    res.json(groups)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let group = req.group
    group = extend(group, fields)
    if (fields.labs) {
      group.labs = JSON.parse(fields.labs)
    }
    group.updated = Date.now()
    if (files.image) {
      group.image.data = fs.readFileSync(files.image.path)
      group.image.contentType = files.image.type
    }
    try {
      await group.save()
      res.json(group)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newLab = async (req, res) => {
  try {
    let lab = req.body.lab

    let labStatus = {"lab": lab["_id"] ,"complete": false }

    let result = await Group.findByIdAndUpdate(req.group._id, { $push: { labs: lab }, updated: Date.now() }, { new: true })
      .populate('instructor', '_id name').exec()

    Enrollment.updateMany({ group: req.group._id }, { $push: { labStatus: labStatus } }, { new: true }).exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let group = req.group
    let deleteGroup = await group.remove()
    res.json(deleteGroup)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isInstructor = (req, res, next) => {
  const isInstructor = req.group && req.auth && req.group.instructor._id == req.auth._id
  if (!isInstructor) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

const listByInstructor = (req, res) => {
  Group.find({ instructor: req.profile._id }, (err, groups) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(groups)
  }).populate('instructor', '_id name')
}

const listPublished = (req, res) => {
  Group.find({ published: true }, (err, groups) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(groups)
  }).populate('instructor', '_id name')
}

const photo = (req, res, next) => {
  if (req.group.image.data) {
    res.set("Content-Type", req.group.image.contentType)
    return res.send(req.group.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage)
}


export default {
  create,
  groupByID,
  read,
  list,
  remove,
  update,
  isInstructor,
  listByInstructor,
  photo,
  defaultPhoto,
  newLab,
  listPublished,
  groupByCode
}
