import React, { useState } from "react";
import "../styles/Register.css";
import validator from 'validator';
import axios from 'axios';
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
    
  //password requirements
  const options = {
    minLength: 8,
    minLowercase: 0,     // Minimum number of lowercase letters (optional)
    minUppercase: 0,     // Minimum number of uppercase letters (optional)
    minNumbers: 0,       // Minimum number of numbers (optional)
    minSymbols: 0,       // Minimum number of symbols (optional)
    returnScore: false,   // Whether to return the score of password strength (optional)
  }
  // Handle register button / form validation
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check for empty fields
    if (!name) 
    {
      setErrorMsg("Name is required!");
      return; 
    
    } else if (!email) 
    {
      setErrorMsg("Email is required!");
      return; 
    
    } else if (!password) 
    {
        setErrorMsg("Password is required!");
        return; 
    } 
    
    // correct format checks
    if(!validator.isEmail(email))
    {
        setErrorMsg("Email is in the wrong format");
        return;
    } else if (!validator.isStrongPassword(password, options))
    {
        setErrorMsg("Password must be at least 8 characters");
        return;
    }
  
    // If all fields are filled, clear the error and proceed
    setErrorMsg(""); 
    
    //query the sql database
    const registerUser = async () => {
      try {
        const data = { firstName: name, email: email, password: password };
        const response = await axios.post("http://localhost:3001/auth/register", data);
        alert("Form submitted successfully!");
        navigate('/login');
      } catch (error) {
        console.error(error);
        setErrorMsg('Registration failed. Please try again.');
      }
    };
    registerUser();
  };


  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">Create an account</h2>
                  <form onSubmit={handleSubmit}>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Name
                      </label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="form3Example3cg">
                        Your Email
                      </label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                    </div>
                    <div id="passwordHelpBlock" class="form-text">
                        Your password must be at least 8 characters long
                    </div>
                    {/* Render error message conditionally */}
                    {errorMsg && (
                      <div id="passwordError" className="text-danger mt-1">
                        {errorMsg}
                      </div>
                    )}

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <a href="Login" className="fw-bold text-body">
                        <u>Login here</u>
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;

