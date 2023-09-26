import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Register = () => {
    const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // Successful login. Redirect or update UI as needed.
                console.log("Logged in as:", result.user.displayName);
            })
            .catch((error) => {
                console.error("Error during Google sign-in:", error);
            });
    };

    return (
        <div className="register-container">
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            <h6>Already have an account? <button onClick={() => {
                // Handle traditional email/password login
            }}>Login</button></h6>
        </div>
    );
};

// import { GoogleButton } from 'react-google-button';
// import { UserAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const { googleSignIn, user } = UserAuth();
//   const navigate = useNavigate();

//   const handleGoogleSignIn = async () => {
//     try {
//       await googleSignIn();
//     } catch (error) {
//       console.log(error);
//     }
//   };

// //   useEffect(() => {
// //     if (user != null) {
// //       navigate('/account');
// //     }
// //   }, [user]);

//   return (
//     <div>
//       <h1 className='text-center text-3xl font-bold py-8'>Sign in</h1>
//       <div className='max-w-[240px] m-auto py-4'>
//         <GoogleButton onClick={handleGoogleSignIn} />
//       </div>
//     </div>
//   );
// };

// export default Register;