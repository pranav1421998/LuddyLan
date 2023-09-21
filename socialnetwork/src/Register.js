import React,{useState} from "react";
export const Register=()=>{
    const {email,setEmail} = useState('');
    const {password,setPass} = useState('');
    const handleSubmit=()=>{
        email.preventDefault();
        console.log(email);
      }
    
    return(
        <>
            <form onSubmit={handleSubmit}>
                <label for="email">New Email: </label>
                <input type="email" value={email} placeholder="username@gmail.com" id="email" name="email"></input> <br></br>
                <label for="password">New Password: </label>
                <input type="password" value={password} placeholder="*********" id="password" name="password"></input>
            </form>
            <h6>Already have an account? <button>Login</button></h6>
        </>
    )
}