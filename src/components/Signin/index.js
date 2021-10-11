import { useState } from "react";
import "./Signin.css";
import { Link, useHistory } from "react-router-dom";
import { showError, startLoading, stopLoading } from "../../actions/index";
import { connect } from "react-redux";
import axios from "axios";

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
  };
};

const mapDispatchToProps = {
  showError: showError,
  startLoading: startLoading,
  stopLoading: stopLoading,
};

const Signin = (props) => {
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  let history = useHistory();

  const handleInputChange = (e) => {
    setSigninData({
      ...signinData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.startLoading();

    axios.post(`http://localhost:5000/api/auth/signin`, signinData).then(
      (response) => {
        if (response.data.success) {
          // console.log("pass", response.data);
          localStorage.setItem("token", response.data.token);
          history.push("/");
          props.stopLoading();
        } else {
          console.log("failed", response.data.message);
          props.stopLoading();
          props.showError(response.data.message);
        }
      },
      (error) => {
        // console.log("Error", error);
        props.stopLoading();
        props.showError("Unable to send request");
      }
    );
  };

  return (
    <div className="Signin">
      <h2>SIGN IN</h2>
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
            value={signinData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-child">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password here"
            minLength="6"
            maxLength="10"
            required
            name="password"
            value={signinData.password}
            onChange={handleInputChange}
          />
        </div>
        <input className="submit-button" type="submit" />
      </form>
      <div className="alt">
        <p>
          Dont have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
