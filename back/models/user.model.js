const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: true,
        },
    }
);



userSchema.plugin(validator);
const UserModel = mongoose.model('user', userSchema);
module.exports= UserModel;



