import { useRef, useState } from "react";
import "./register.css";
import { IoMdPin } from "react-icons/io";
import { MdOutlineCancelPresentation } from "react-icons/md";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    try {
      await axios.post(
        "https://mappin-7xjq.onrender.com/api/user/register",
        newUser
      );
      setError(false);
      setSuccess(true);
    } catch (error) {
      console.log(error.message);
      setError(true);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <IoMdPin />
        <span>PrmPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="password"
          ref={passRef}
          autoComplete="current-password"
        />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Successfull.You can login now</span>
        )}
        {error && <span className="failure">Something went wrong !!</span>}
      </form>

      <MdOutlineCancelPresentation
        className="cross"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
