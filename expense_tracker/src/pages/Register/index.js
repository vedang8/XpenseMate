import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Import the CSS file

function Register() {
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
      const response = await fetch("http://localhost:5013/api/User/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success("User registered successfully");
        setInpval({
          name: "",
          password: "",
        });
        navigate("/login");
      } else {
        message.error("User already exists");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while registering the user");
    }
  };

  return (
    <div className="container">
      <div className="sign-up">
        <form>
          <h1>Sign Up</h1>
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
            Sign Up
          </button>
        </form>
        <p className="login-prompt">
          Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;

