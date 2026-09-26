import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const register =  async(req,res)=>{
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const existingUser =await User.findOne({email})
        console.log(existingUser);
        if(existingUser){
            return res.status(409).json({
                message:"user already exist"
            });
        }

        // Hash password
        const hashedpassword = await bcrypt.hash(password,10)

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })

        res.status(201).json({
            message:"Registration successfull",
            user:{
                 id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
const login = async(req,res)=>{
    try {
         const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        //compare possword
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        // generate token
        const token = jwt.sign(
            {
                userId : user._id
            },
            process.env.JWT_SECRETKEY,
            {
                expiresIn : "1d"
            }
        )

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
}

export default {
    register,
    login
}