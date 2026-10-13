
const User = require("../models/Users.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();


//// signup controllers

const signup = async(req,res)=>{


  console.log("HHDSH")

  try{
    const {name,email,password,role}= req.body;
    console.log(name,email,password,role)
    const hashpasword = await bcrypt.hash(password,10)

    const newUser = await User.create({
      name,
      role,
      password:hashpasword,
      email
    })
    res.status(200).json({success:true , msg : "user added successfully" , newUser})

  }catch(error){

    res.status(500).json({success:false , msg : error.massage})

  }




}










const login = async(req,res)=>{

  // res.json(FindUser)
  // console.log(FindUser)


try{
    const {email,password} = req.body;
  const user = await  User.findOne({email})


  if(!user){
    res.status(404).json({success:false, error :"user not Found"})
  }
const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
  res.status(404).json({success : false , error : "wrong password"})
}

const token = jwt.sign({_id :user._id , email : user.email},process.env.JWT_KEY,{expiresIn:"10d"}

)


   res.status(200)
   .json({message:"Login successfully ",
    success:true,
    token,
    email,
   user:{name:user.name,email:user.email,role:user.role}
  
  })







}catch(error){
res.status(500)
.json({success:false ,error: error.massage})
}

  
}



//// verify 

const verify = (req,res)=>{

  
  return res.status(200).json({success:true, user:req.user})
}









module.exports = {
  login,
  signup,
  verify
}