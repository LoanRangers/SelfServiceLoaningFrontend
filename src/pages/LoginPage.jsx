import React, { useState } from 'react'
import './LoginPage.css'

import email_icon from '../assets/email.png'
import user_icon from '../assets/user.png'
import password_icon from '../assets/password.png'

export const LoginSignup = () => {
    const[action, setAction] = useState("Login")

    const handleLogin = () => {
        window.location.href = "http://localhost:3000/auth/gitlab"
    }

    return (
        <div className='login'>
            <div className="header">
                <div className="text">
                    {action}
                </div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>:<div className="input">
                    <img src={user_icon} alt=""/>
                    <input type="text" placeholder='Name'/>
                </div>}
                <div className="input">
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder='Email'/>
                </div>
                <div className="input">
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder='Password'/>
                </div>
            </div>
            <div className="gitlab">
                <button className='gitlabbtn' onClick={handleLogin}>Login with Gitlab</button>
            </div>
            <div>Forgot password?<a href="https://idm.utu.fi">Click here</a></div>
            <div className="submit-container">
                <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup