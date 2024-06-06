import React from 'react';
import './AnimatedFormContainer.css';

const AnimatedFormContainer = ({ children }) => {
  const [isSignUp, setIsSignUp] = React.useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      {children}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={toggleSignUp}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={toggleSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFormContainer;
