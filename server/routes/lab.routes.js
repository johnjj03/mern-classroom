import express from 'express'
import authCtrl from '../controllers/auth.controller'
import labCtrl from '../controllers/lab.controller'

const router = express.Router()

router.route('/api/labs')
    .get(authCtrl.requireSignin,labCtrl.getLabs)


export default router
