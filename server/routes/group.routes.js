import express from 'express'
import groupCtrl from '../controllers/group.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/groups/published')
  .get(groupCtrl.listPublished)

router.route('/api/groups/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isEducator, groupCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, groupCtrl.listByInstructor)

router.route('/api/groups/photo/:groupId')
  .get(groupCtrl.photo, groupCtrl.defaultPhoto)

router.route('/api/groups/defaultphoto')
  .get(groupCtrl.defaultPhoto)

router.route('/api/groups/:groupId/lab/new')
  .put(authCtrl.requireSignin, groupCtrl.isInstructor, groupCtrl.newLab)

router.route('/api/groups/:groupId')
  .get(groupCtrl.read)
  .put(authCtrl.requireSignin, groupCtrl.isInstructor, groupCtrl.update)
  .delete(authCtrl.requireSignin, groupCtrl.isInstructor, groupCtrl.remove)

router.param('groupId', groupCtrl.groupByID)
router.param('userId', userCtrl.userByID)

export default router
