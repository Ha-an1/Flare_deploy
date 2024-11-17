import { useState } from "react";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link } from "react-router-dom";

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
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      toast.success("Logged in with Google!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
        <button onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? "Loading" : "Sign In with Google"}
        </button>
        <p>Don’t have an account yet?&nbsp;<Link to="/signup" className="custom-link">Signup</Link></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
