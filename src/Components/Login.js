import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import Loading from './Loading';
import { useUserRights } from './UserRightsContext';
import logo from "../assets/logo.jpeg";

const LoginForm = () => {
  const { setUserRights, setUserId } = useUserRights();
  const[showPassword, setshowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post('http://182.18.144.204:50019/auth/login', formData);

      if (response.data.status === 200) {
        const token = response.data.result.token;
        const userRightsString = response?.data?.result?.rslt?.Table1[0]?.Rights_Names;
        const userRights =  userRightsString?.split(',');
        setUserRights(userRights);
        const userId = response?.data?.result?.rslt?.Table1[0]?.userId;
        setUserId(userId);
        localStorage.setItem("userId", userId);
        console.log(userRights);
        console.log(token);
        console.log('Login successful', response.data);
        setLoading(false);
        toast.success('Login Successful');
        localStorage.setItem('accessToken', token);
        navigate(`/dashboard`);
      } else {
        toast.error('Invalid Credentials');
        setLoading(false)
        navigate('/')
      }

      localStorage.setItem('savedCredentials', JSON.stringify(formData));
    } catch (error) {
      toast.error('Something went wrong');
      navigate('/')
      setLoading(false)
      console.error('Login failed', error);
    }
  };

  const handleTogglePassword = () => {
    setshowPassword(!showPassword);
  };

  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(storedRememberMe);

    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      setFormData(JSON.parse(savedCredentials));
    }
  }, []);

  return (
    <div className='h-screen'>
    {
      loading ? (<Loading/>) : 
      (<div className="max-h-screen bg-gray-50 flex items-center justify-center overflow-y-hidden">
      {/* login container */}
      <div className="bg-[#9BB8CD] flex shadow-lg w-full h-screen items-center">
        {/* form */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <svg
                onClick={handleTogglePassword}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                className="bi bi-eye absolute top-1/2 right-3 cursor-pointer -translate-y-1/2"
                viewBox="0 0 16 16"
                
              >
                {showPassword ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </svg>
            </div>
            <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">
              Login
            </button>
          </form>
        </div>

        {/* image */}
        <div className="md:block w-[100vw] hidden">
          <img
            className="h-[75vh] rounded-lg shadow-xl mx-auto w-[80%] m-0"
            src={logo}
            alt="Login"
            loading='lazy'
          />
        </div>
      </div>
    </div>)
    }
    
    </div>
  );
};

export default LoginForm;
