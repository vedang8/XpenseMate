import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Import the CSS file

function Login() {
  const [inpval, setInpval] = useState({
    name: "",
    password: "",
  });
  const navigate = useNavigate();
  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const addUserData = async (e) => {
    e.preventDefault();

    const { name, password } = inpval;

    if (name === "" || password === "") {
      message.error("Please fill in all the fields");
      return;
    }

    if (password.length < 6) {
      message.error("Password must be at least 6 characters long");
      return;
    }

    const formData = {
      name,
      password,
    };

    try {
      const response = await fetch("http://localhost:5013/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success("User logged in successfully");
        message.success("🎉Welcome to Xpense Mate!");
        setInpval({
          name: "",
          password: "",
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate("/home");
      } else {
        message.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to login");
    }
  };

  return (
    <div className="container">
      <div className="sign-in">
        <form>
          <h1>Sign In</h1>
          <div className="form_input">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              onChange={setVal}
              value={inpval.name}
              name="name"
              id="name"
              placeholder="Enter your Name"
              required
            />
          </div>
          <div className="form_input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={setVal}
              value={inpval.password}
              name="password"
              id="password"
              placeholder="Enter your Password"
              required
            />
          </div>
          <button className="btn" onClick={addUserData}>
            Sign In
          </button>
        </form>
        <p className="register-prompt">
          Don't have an account? <span className="register-link" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
