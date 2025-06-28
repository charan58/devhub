import './Register.css';
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

function Register() {
    const { register, handleSubmit, formState: { errors, isValid }, watch, trigger, reset } = useForm({ mode: 'onChange' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleRegister = async (registerObj) => {
        const { confirmPassword, ...registerData } = registerObj;
        try {
            const API_BASE = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_BASE}/user-api/register`, registerData);
            toast.success("Registered Successfully!");
            reset();
        } catch (error) {
            toast.error("Registration error");
        }
    };


    const watchPasswordValue = watch('password');
    const watchConfirmPasswordValue = watch('confirmPassword');

    const evaluatePasswordStrength = useCallback((password) => {
        if (!password) return '';
        const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        const medium = /^(?=.*[a-z])(?=.*\d).{6,}$/;
        return strong.test(password) ? 'Strong' : medium.test(password) ? 'Medium' : 'Weak';
    }, []);

    useEffect(() => {
        setPasswordStrength(evaluatePasswordStrength(watchPasswordValue));
    }, [watchPasswordValue]);

    useEffect(() => {
        if (watchPasswordValue) trigger('confirmPassword');
    }, [watchConfirmPasswordValue, trigger, watchPasswordValue]);

    return (
        <div className="register-container">
            <div className='register-content'>
                <h2>Register</h2>
                <form onSubmit={handleSubmit(handleRegister)}>

                    {/* Username */}
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            autoComplete="username"
                            {...register("username", {
                                required: "*username required",
                                maxLength: { value: 10, message: "*should not exceed 10 characters" },
                                minLength: { value: 4, message: "*should be minimum 4 characters" },
                                pattern: { value: /^[A-Za-z][A-Za-z0-9_]{3,10}$/, message: "*invalid username" }
                            })}
                        />
                        {errors.username && <p className="text-error">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            autoComplete="email"
                            {...register("email", {
                                required: "*email required",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "*invalid email" }
                            })}
                        />
                        {errors.email && <p className="text-error">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                {...register("password", {
                                    required: "*password required",
                                    minLength: { value: 6, message: "*password should be minimum 6 characters" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                        message: "*must include uppercase, lowercase, number & special character"
                                    }
                                })}
                            />
                            <button type="button" className="eye-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)} aria-label="Toggle password visibility">
                                {isPasswordVisible ? <RxEyeClosed /> : <RxEyeOpen />}
                            </button>
                        </div>
                        {errors.password && <p className="text-error">{errors.password.message}</p>}
                        {watchPasswordValue && (
                            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                                Password Strength: {passwordStrength}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-with-icon">
                            <input
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                {...register("confirmPassword", {
                                    required: "*confirm your password",
                                    validate: (value) => value === watchPasswordValue || "*passwords do not match"
                                })}
                            />
                            <button type="button" className="eye-icon" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} aria-label="Toggle confirm password visibility">
                                {isConfirmPasswordVisible ? <RxEyeClosed /> : <RxEyeOpen />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-error">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit */}
                    <div>
                        <button type="submit" disabled={!isValid} className={!isValid ? 'disabled-button' : ''}>
                            Register
                        </button>

                    </div>

                    <p>Already have an account? <Link to="/">Login</Link> here.</p>
                </form>
            </div>
        </div>
    );
}

export default Register;
