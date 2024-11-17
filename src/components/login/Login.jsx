import { useState } from "react";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider(); // Create Google provider

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User  Info: ", user);
      await setDoc(doc(db,"users",user.uid),
      {
        username:user.displayName,
        email:user.email,
        avatar:"./avatar.png",
        id:user.uid,
        blocked:[],
      }
    );
    await setDoc(doc(db,"userchats",user.uid),{
      chats:[],
    });

      // You can handle user info or redirect after successful login
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <p>Don’t have an account yet?&nbsp;<Link to="/signup" className="custom-link">Signup</Link></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;