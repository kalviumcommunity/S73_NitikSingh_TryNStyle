import { useState } from "react"; //React Hook to manage state variables.
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {FcGoogle} from "react-icons/fc"
import { auth } from "../../firebaseConfig";  // ✅ Correct Import
const provider = new GoogleAuthProvider()

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);  //Opens a Google sign-in popup
      alert("Signed in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password); //Creates a new user with the provided email and password.
      alert("User Registered!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User Logged In!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-200">
      <div className="w-[700px] h-[500px] bg-white shadow-lg rounded-lg overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-1"
        >
          {isLogin ? (
            <div className="w-full max-w-md text-left mt-2 bg-blue-400">
              <h2 className="text-3xl font-bold text-blue-500 absolute left-35 top-20 mb-1">Login</h2>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-70 p-3 mt-3 border rounded-lg absolute left-10 top-35"
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-70 p-3 mt-3 border rounded-lg focus:outline-blue-500 absolute left-10 top-52"
                onChange={(e) => setPassword(e.target.value)} 
              />
              <motion.div
                initial={{ x: isLogin ? "0%" : "100%" }} 
                animate={{ x: isLogin ? "100%" : "0%" }} 
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="bg-blue-400 text-white flex flex-col justify-center items-center rounded-tl-[150px] rounded-bl-[150px] absolute inset-0 w-1/2 h-full">
                <h1 className="text-3xl font-bold mb-2">Hello, Welcome!</h1>
                <p className="mb-3">Don't have an account?</p>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="mt-4 px-6 py-3 border border-white rounded-md transition hover:bg-white hover:text-blue-500">
                  Register
                </button>
              </motion.div>
              <button 
                className="w-70 mt-4 px-5 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 absolute left-10 bottom-40" 
                onClick={handleLogin}>
                Login
              </button>
              <p className="text-gray-500 absolute left-26 top-90">Or, Sign in with Google</p>
              <button 
                className="w-70 mt-4 px-5 py-3 bg-white text-black flex items-center justify-center gap-2 border rounded-lg hover:bg-gray-200 absolute left-10 bottom-10" 
                onClick={handleGoogleSignIn}>
                <FcGoogle size={24} /> Continue with Google
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md text-right mt-2">
              <h2 className="text-3xl font-bold text-blue-500 absolute right-16 top-20">Create an Account</h2>
              <p className="text-gray-500 absolute right-17 top-30">Join us and explore new features!</p>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-70 p-3 mt-3 border rounded-lg focus:outline-blue-400 absolute right-10 top-35"
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-70 p-3 mt-3 border rounded-lg focus:outline-blue-400 absolute right-10 top-51"
                onChange={(e) => setPassword(e.target.value)} 
              />
              <p className="text-gray-500 absolute right-26 top-85">Or, Sign in with Google</p>
              <button 
                className="w-70 mt-4 px-5 py-3 bg-white text-black flex items-center justify-center gap-2 border rounded-lg hover:bg-gray-200 absolute right-10 bottom-20" 
                onClick={handleGoogleSignIn}>
                <FcGoogle size={24} /> Continue with Google
              </button>
              <motion.div
                initial={{ x: isLogin ? "-100%" : "0%" }} 
                animate={{ x: isLogin ? "0%" : "-100%" }} 
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-90 h-full bg-blue-400 text-white flex flex-col justify-center items-center rounded-tr-[150px] rounded-br-[150px] absolute top-0 right-0">
                <h1 className="text-3xl font-bold mb-2">Welcome, Back!</h1>
                <p className="mb-3">Already have an account?</p>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="mt-4 px-6 py-3 border border-white rounded-md transition hover:bg-white hover:text-blue-500">
                  Login
                </button>
              </motion.div>
              <button 
                className="w-70 mt-4 px-5 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 absolute right-10 bottom-42" 
                onClick={handleRegister}>
                Register
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
