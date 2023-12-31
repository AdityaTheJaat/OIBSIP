import React, { useContext, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link } from 'react-router-dom';
import { unAuthenticatedPostRequest } from '../../apiCalling/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AuthContext);
  if(userData?.role === "Admin"){
    navigate('/adminPanel')
  }
  else if(userData?.role === "Customer"){
    navigate('/home')
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    const data = {email, password};
    const response = await unAuthenticatedPostRequest('/auth/login', data, navigate, "login", setToken, setUserData, token);
    if(response){
      toast.success("Login Successful!")
    }
    else{
      toast.error("Failed Login!")
    }
  }
  return (
    <div className='h-screen w-full bg-gradient-to-b from-[#1f2728] via-[#131618] to-[#070808] p-10'>
      <form onSubmit={submitHandler} className='md:w-[50%] md:mt-5 bg-[#070808] space-y-10 text-white rounded-xl mx-auto flex flex-col items-center justify-center p-10'>
        <p className='text-3xl md:text-5xl font-bold text-center'>Log in to Pizza Factory</p>
        <div className='h-[1px] w-[90%] bg-gray-700 my-3'></div>
        <div>
          <label htmlFor='email'>Email Id</label>
          <input 
            name='email'
            type='email'
            id='email'
            placeholder='Email Id'
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            className="w-full rounded-[0.5rem] bg-slate-800 p-[12px]"
          />
        </div>
        <div className='relative'>
          <label htmlFor='password'>Password</label>
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          <input 
            name='password'
            type={showPassword ? "text" : "password"}
            id='password'
            placeholder='Password'
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            className="w-full rounded-[0.5rem] bg-slate-800 p-[12px]"
          />
        </div>
        <button type='submit' className='bg-green-500 rounded-2xl py-3 w-[30%] px-2'>Log In</button>
        <div className='h-[1px] w-96 bg-gray-700 my-3'></div>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
        <div className='flex flex-col justify-center items-center'>
          <p>Don't have an account?</p>
          <Link to='/signup'><u>Sign up</u></Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage