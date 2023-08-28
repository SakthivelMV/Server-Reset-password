const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretkey = "12345678998745632112365478998745"


//Schema 
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    cpassword:{
        type:String,
        required:true,
        minlength:8
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
});



// Hash password
userSchema.pre("save",async function (next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next()
});

// Generate token
userSchema.methods.generateAuthtoken = async function(){
try{
let token1 = jwt.sign({_id:this._id},secretkey,{
    expiresIn:"1d"
});
this.tokens = this.tokens.concat({token:token1});
await this.save();
return token1;
}catch(error){
res.status(400).json(error)
}
}

// Model
const userdb = new mongoose.model("Users",userSchema);
module.exports = userdb;