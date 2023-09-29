import React,{useState} from "react";

export default function Password () {
    const [password,setPassword]=useState('');
    const [confirmPass,setConfirmPass]=useState('');
    const handleSavePassword= (e)=>{
        e.preventDefault();
        console.log(password);
    }
    return(
        <div className="auth-form-container">
            <h2>Create Password</h2>
        <form className="createpassword-form" onSubmit={handleSavePassword}>
            <label htmlFor="password">Create a Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)}value={password} placeholder="********" id="password" name="password"></input>
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input type="password" onChange={(e) => setConfirmPass(e.target.value)}placeholder="********" value={confirmPass} id="confirmpassword" name="confirmpassword"></input>
            <button type="sumit" onClick={handleSavePassword}>Save Password</button>
        </form>
        </div>
    )
}