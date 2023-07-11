import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import groupCtrl from '../controllers/group.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

// router.route('/api/enrollment/new/:groupId')
//   .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)

// router.route('/api/enrollment/remove/:groupId')
//   .delete(authCtrl.requireSignin, authCtrl.hasAuthorization , enrollmentCtrl.removeall)

router.route('/api/enrollment/new/:groupCode')
      .post(authCtrl.requireSignin,
            enrollmentCtrl.findEnrollment,
        enrollmentCtrl.join)

router.route('/api/enrollment/stats/:groupId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.complete) 

router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.remove)

router.route('/api/enrollment/join/:enrollmentCode')
  .post(authCtrl.requireSignin, enrollmentCtrl.isStudent,enrollmentCtrl.create)

router.route('/api/enrollment/students/:groupId')
  .get(authCtrl.requireSignin, enrollmentCtrl.getStudents)

router.param('groupId', groupCtrl.groupByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)
router.param('groupCode', groupCtrl.groupByCode)

export default router
