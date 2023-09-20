import React,{useState} from "react";
export const Login=()=>{
    const {email,setEmail} = useState('');
    const {password,setPass} = useState('');
    const handleSubmit=()=>{
      email.preventDefault();
      console.log(email);
    }
    
    return(
      <>
        <form onSubmit={handleSubmit}>
          <label for="email" >Enter your username</label><br></br>
          <input type="email" value={email} placeholder="username@gmail.com" id="email" name="email"></input><br></br>
          <label for="password" >Enter your password</label><br></br>
          <input type="password" value={password} placeholder="*********" id="password" name="password"></input><br></br>
          <button>Login</button>
        </form>
        <h6>Don't have an account?<button>Register</button></h6>
      </>
    )
}