import './Login.css';
import { useForm } from "react-hook-form";
import { useState, useEffect} from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/useAuth';
import { toast } from 'react-toastify';
function Login() {
  const { login, isAuthenticated, error } = useAuth();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  // login submit function
  const handleLogin = (loginObj) => {
    login(loginObj);
    
    setTimeout(()=>{
      navigate('/app')
    }, 2000);
  }

  // un comment this after deving the inside comps
  // useEffect(()=>{
  //   navigate('/app')
  // }, [isAuthenticated])

  return (
    <div className='login-container'>
      <div className='login-content'>
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          {/* email field */}
          <div className='form-field'>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "*email required"
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "*invalid email"
                }
              })}
            />
            {/* error message */}
            {errors.email && <p className="text-error">{errors.email.message}</p>}
          </div>

          {/* password field */}
          <div className='form-field'>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              placeholder="Password"
              {...register("password", {
                required: {
                  value: true,
                  message: "*password required"
                },
                minLength: {
                  value: 6,
                  message: "*should be minimum 6 characters"
                }
              })}
            />
            <span type="button" id="eye-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="Toggle password visibility">
              {isPasswordVisible ? <RxEyeClosed /> : <RxEyeOpen />}
            </span>

            {/* error message */}
            {errors.password && <p className="text-error">{errors.password.message}</p>}
          </div>

          {/* submit button*/}
          <div className='form-btn'>
            <button type="submit" disabled={!isValid}>Login</button>
          </div>

          <p className="">
            New here? you can <span><Link to='/register'>Register</Link></span> here.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login