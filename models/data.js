const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    data:{
        type:String,
        trim:true,
        required:true,
    },
});

module.exports = mongoose.model('Data',userSchema);
