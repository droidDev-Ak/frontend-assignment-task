import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: req.user
  });
};

const generateRandomAccessAndRefreshTokens = async (userId) => {
  try {

    const user = await User.findById(userId);


    const accessToken = user.generateAccessToken();


    const refreshToken = user.generateRefreshToken();


    user.refreshtoken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating Tokens")
  }
};

const registerUser = async (req, res) => {
  const data = req.body;

  const { name, email, password } = data;

  //Checking wheather all fields are present and non-empty strings

  if (
    [name, email, password].some((field) => {
      return typeof field !== "string" || field === "";
    })
  ) {
    return res
      .status(400)
      .send("All fields are required and must be non-empty strings");
  }

  // Check if user already exists


  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });
  if (existingUser) {
    return res.status(401).send("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name,
    email: email.trim().toLowerCase(),
    password: hashedPassword,
  });

  const createdUser=await User.findById(newUser._id).select("-password -refreshtoken")
  if(!createdUser) throw new Error("Error in user creation");

  return res
    .status(200)
    .json({
        message:"User registered successfully",
        user:createdUser,


    });
};

const loginUser = async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  if (
    [email, password].some((field) => {
      return typeof field !== "string" || field.trim() === "";
    })
  ) {
    return res
      .status(400)
      .send("Email and password are required and must be non-empty strings");
  }
  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!existingUser) {
    return res.status(401).send("User with this email does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid Password");
  }

const { accessToken, refreshToken } = await generateRandomAccessAndRefreshTokens(existingUser._id);
const options = {
        httpOnly: true,
        secure: true,

    }
 return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                message:"User Logged in successfully",
                accesstoken:accessToken,
                refreshtoken:refreshToken
            }
        )



};


const logoutUser=async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshtoken: undefined,

        }
    },{
        new:true,
    })
    const option={
        httpOnly:true,
        secure:true,

    }

    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json({
        message:"Logout successfull ",
        
    })

}



export { registerUser, loginUser, logoutUser, getCurrentUser };
