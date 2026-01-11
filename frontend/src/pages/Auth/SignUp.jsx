import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelecter from '../../components/inputs/ProfilePhotoSelecter'
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContex";
import uploadImage from '../../utils/uploadImage'



const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  // Handle SignUp form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullName){
      setError("Please enter your full name.");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter the password.");
      return;
    }

    setError("");
    
    // SignUp API Call
    try {

      // Upload image if present
      if (profilePic) {
        const imgUploadResponse = await uploadImage(profilePic);
        profileImageUrl = imgUploadResponse.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        fullName,
        email,
        password,
        profileImageUrl
      });
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }

  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below.</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelecter image={profilePic} setImage={setProfilePic}/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target})=> setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            <Input 
            value = {email}
            onChange = {({target})=> setEmail(target.value)}
            label = "Email Address"
            placeholder = "john@gmail.com"
            type = "text"
          />
          <div className='col-span-2'>
            <Input 
              value = {password}
              onChange = {({target})=> setPassword(target.value)}
              label = "Password"
              placeholder = "Min 8 characters"
              type = "password"
            />
          </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                    <button type='submit' className='btn-primary'> SIGN UP</button>
          
                    <p className='text-[13px] text-slate-800 mt-3'> Alredy have an account?{""}
                      <Link className='font-medium text-primary underline' to='/login'>Login</Link>
                    </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default SignUp