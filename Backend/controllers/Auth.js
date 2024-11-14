const Users = require('../models/Profile')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otp = require('otp-generator')
exports.SignUp = async(req,res)=>{
    try {

        const {Username ,firstName ,lastName ,password ,confirmPassword,email} = req.body

        if(!Username || !firstName || !lastName || !password || !confirmPassword){
            return res.status(404).json({
                message:"All the fields are  required",
                success:false
            })
        }

        const Username_matching = await Users.findOne({Username})

        if(Username_matching){
            return res.status(409).json({
                message:"This username already exists please take another one",
                success:false
            })
        }

        if(password !== confirmPassword){
            return res.status(401).json({
                message:"The passwords are not valid",
                success:false
            })
        }


        const Email_Checking = await Users.findOne({email})
        if(Email_Checking){
            return res.status(409).json({
                message:"The email is already presernt",
                success:false
            })
        }



        const hashedPassword = await bcrypt.hash(password,10)
        const UserS = await Users.create({Username ,firstName ,lastName ,password:hashedPassword,confirmPassword:hashedPassword ,email,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        }) 
        console.log("This is the userd",UserS)
        return res.status(200).json({
            message:"The data is been uploaded",
            success:true
        })

    } catch (error) {
        console.log("This is the error in the code");
        console.log(error)
        console.log(error.message)
    }
}



exports.Login = async(req,res)=>{
    try {

        const {email,password} = req.body
        if(!email || !password ){
            return res.status(404).json({
                message:"All the Fields Are required",
                success:false
            })
        }

        const Finding = await Users.findOne({email})
        if(!Finding){
            return res.status(404).json({
                message:"The email is not present please sign in",
                success:false
            })
        }
        console.log("The all the findings are",Finding)
        const PassCompare = await bcrypt.compare(password,Finding.password)
        if(!PassCompare){
            return res.status(404).json({
                messsage:"The password is not correct",
                success:false
            })
        }
            const token = jwt.sign({email:Finding.email,id:Finding._id,Username:Finding.Username},process.env.JWT_SECRET,{
                expiresIn : '8h'
            })


            const options = {
                expires : new Date(Date.now() +3 * 24 * 60 * 1000),
                httpOnly:true
            }

            console.log("This is the user token",token)
            console.log("THese are the users options",options)
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user:Finding,
                message : "user is been loged in "
            })
    } catch (error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
    }
}


exports.Update = async(req,res)=>{
    try {

        const id = req.user.id
        const {firstName,lastName,password} = req.body
        
        const Finding = await Users.findOne({_id:id});
        if(!Finding){
            return res.status(409).json({
                message:"The ids are not presneet",
                success:false
            })
        }

        if(!firstName || !lastName || !password){
            return res.status(404).json({
                message:"All the Fields are required",
                success:false
            })
        }

        const passChange = await bcrypt.hash(password,10)
        const changeFirstName = await Users.findByIdAndUpdate(id,{firstName:firstName,lastName:lastName,password:passChange},{new:true})
        // await Users.save()

        console.log("This is the chages user and the changes",changeFirstName)

        return res.status(200).json({
            message:"The data is been updates",
            success:true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })        
    }
}

exports.AllUsers = async(req,res)=>{
    try {
        const GetAll = await Users.find({})
        console.log("Theser are all the usrs that are present",GetAll)
        return res.status(200).json({
            message:"Here are all the users",
            success:true,
            GetAll
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })    
    }
}

exports.Users = async (req,res) => {
    try {
        const {id} = req.query
        const Finding = await Users.findOne({_id:id});
        
        if(!Finding){
            return res.status(400).json({
                message:"The user id does not exist",
                success:false
            })
        }


        console.log("This is the Findings",Finding)

        return res.status(200).json({
            message:"Ther is  the data for th specific id",
            success:false
        })




    } catch (error) {

        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })
    }
}


exports.FindUsingName = async(req,res)=>{
    try {
        const filter = req.query.filter || "";
        const users = await Users.find({
            $or:[{
                firstName:{
                    "$regex":filter,
                    "$options": "i"
                }
            },{
                lastName:{
                    "$regex":filter,
                    "$options": "i"
                }
            }]
        })

        const data = users.map(user=>({
            Username:user.Username,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            _id:user._id
        }))

        if(!data){
            return res.status(404).json({
                message:"The name is not presnet",
                success:false
            })
        }
        console.log("This is after the filtering the data",data)

        return res.status(200).json({
            success:true,
            message:"The data after the filtering is here",
            data:data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is some error from the backend",
            success:false
        })
    }
}
