const dataModel = require('../models/data');

exports.getData =async function(req, res) {
    try {
        const result = await dataModel.findById('5ef83a372f8f471fa0605131');
        const data = JSON.parse(result.data);
        return res.status(200).json({success:true, data});
        return -1;
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({success:false, error:err});
    }
}
