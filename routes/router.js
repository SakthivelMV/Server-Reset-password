const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema")
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate")

// User Registration
router.post("/register",async(req,res)=>{
    const {fname,email,password,cpassword} = req.body;
    if(!fname || !email || !password || !cpassword){
        res.status(400).json({error:"Fill all"})
    }
    try{
        const preuser = await userdb.findOne({email:email});
        if (preuser){
            res.status(400).json({error:"Email exists"})
        }else if(password!==cpassword){
            res.status(400).json({error:"Password & confirm password should be same"})
        }else{
            const finalUser = new userdb({
                fname,email,password,cpassword
            });
            // password hashing
            const storeData = await finalUser.save();
            console.log(storeData)
            res.status(200).json({status:200,storeData});
        }
    }catch(error){
        res.status(400).json(error);
        console.log("Block error")
    }
})

// login

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).json({error:"Fill all"})
    }
    try{
        const userValid = await userdb.findOne({email:email});
        if (userValid){
            const isMatch = await bcrypt.compare(password,userValid.password);
            if(!isMatch){
                res.status(400).json({error:"invalid credentials"})
            }else{
                const token = await userValid.generateAuthtoken();
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });
                const result ={ userValid, token}
                res.status(200).json({status:200,result})
            }
        }
    }catch (error){
        res.status(400).json(error);
        console.log("Catch Error")
    }
})

//valid user
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(200).json({status:200,ValidUserOne});
    } catch (error) {
        res.status(400).json({status:400,error});
    }
});

//logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(200).json({status:200})

    } catch (error) {
        res.status(400).json({status:400,error})
    }
})

module.exports = router;