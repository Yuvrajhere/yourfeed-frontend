import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment-timezone";
import { startLoading, stopLoading, showError } from "../../actions/index";
import "./Signup.css";

const mapStateToProps = (state) => {
  return {
    error: state.error,
  };
};

const mapDispatchToProps = {
  startLoading: startLoading,
  stopLoading: stopLoading,
  showError: showError,
};

const Signup = (props) => {
  const [signupData, setSignUpData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });

  let history = useHistory();

  const handleInputChange = (e) => {
    setSignUpData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.startLoading();
    if (signupData.password1 !== signupData.password2) {
      props.stopLoading();
      return props.showError("Passwords do not match");
    }
    const data = {
      email: signupData.email,
      username: signupData.username,
      password: signupData.password1,
      is_admin: 0,
      posts_count: 0,
      register_date: moment().tz("Asia/Kolkata").format(),
    };

    axios.post(`http://localhost:5000/api/users/`, data).then(
      (response) => {
        if (response.data.success) {
          // console.log("pass", response.data);
          history.push("/signin");
          props.stopLoading();
          props.showError("Please signin with email and password now.");
        } else {
          // console.log("failed", response.data.message);
          props.stopLoading();
          props.showError(response.data.message);
        }
      },
      (error) => {
        console.log("Error", error);
        if (error.response.status === 409) {
          props.stopLoading();
          props.showError("Email or username already exists");
        } else {
          props.stopLoading();
          props.showError("Unable to send request");
        }
      }
    );
  };

  return (
    <>
      {props.error.length > 0 ? null : (
        <div className="Signup">
          <h2>SIGN UP</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-child">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Enter email here"
                minLength="5"
                maxLength="30"
                required
                name="email"
                value={signupData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-child">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter username here"
                minLength="5"
                maxLength="30"
                required
                name="username"
                value={signupData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-child">
              <label htmlFor="password1">Password</label>
              <input
                type="password"
                id="password1"
                placeholder="Enter password here"
                minLength="6"
                maxLength="10"
                required
                name="password1"
                value={signupData.password1}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-child">
              <label htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                id="password2"
                placeholder="Enter password again here"
                minLength="6"
                maxLength="10"
                required
                name="password2"
                value={signupData.password2}
                onChange={handleInputChange}
              />
            </div>
            <input className="submit-button" type="submit" />
          </form>
          <div className="alt">
            <p>
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
