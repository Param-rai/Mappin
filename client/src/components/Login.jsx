import { useRef, useState } from "react";
import "./login.css";
import { IoMdPin } from "react-icons/io";
import { MdOutlineCancelPresentation } from "react-icons/md";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };

    try {
      const res = await axios.post(
        "https://mappin-7xjq.onrender.com/api/user/login",
        user
      );
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setError(false);
      setShowLogin(false);
    } catch (error) {
      console.log(error.message);
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <IoMdPin />
        <span>PrmPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          ref={nameRef}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="password"
          ref={passRef}
          autoComplete="current-password"
        />
        <button className="registerBtn">Login</button>
        {error && <span className="failure">Something went wrong !!</span>}
      </form>

      <MdOutlineCancelPresentation
        className="cross"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
