import Lab from '../models/lab.model'
import errorHandler from '../helpers/dbErrorHandler'


const getLabs = async (req,res) => {
    try {
        let labs = await Lab.find().select('_id name description flagable flags difficulty')
        res.json(labs)
    }
    catch(err) {
        return res.status(400).json({
            error:errorHandler.getErrorMessage(err)
        })
    }                       
}

export default {
    getLabs
}