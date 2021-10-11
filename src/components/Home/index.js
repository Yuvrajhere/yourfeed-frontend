import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Home.css";
import userPlaceholderImage from "../../assets/user_placeholder.png";
import { Link } from "react-router-dom";
import { showError, startLoading, stopLoading } from "../../actions";
import axios from "axios";
import jwt_decode from "jwt-decode";
import PostsList from "../PostsList";

const mapStateToprops = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError,
  startLoading,
  stopLoading,
};

const Home = (props) => {
  const [userData, setUserData] = useState({
    username: "",
    profilePhoto: "",
  });

  const [trigger, setTrigger] = useState(false);

  const { startLoading, stopLoading, showError } = props;

  useEffect(() => {
    startLoading();
    axios
      .get(
        `http://localhost:5000/api/users/${
          jwt_decode(localStorage.getItem("token")).result
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            // console.log("pass", response.data.data.profile_photo);
            if (response.data.data.profile_photo === null) {
              setUserData({
                ...userData,
                username: response.data.data.username,
                profilePhoto: userPlaceholderImage,
              });
              stopLoading();
            } else {
              setUserData({
                ...userData,
                username: response.data.data.username,
                profilePhoto:
                  "data:image/jpeg;base64," +
                  new Buffer(
                    response.data.data.profile_photo,
                    "binary"
                  ).toString("base64"),
              });
              stopLoading();
            }
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
            stopLoading();
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
          stopLoading();
        }
      );
  }, [ startLoading, stopLoading, showError]);

  const [postsDataArray, setPostsDataArray] = useState([]);

  useEffect(() => {
    startLoading();
    axios
      .get(
        `http://localhost:5000/api/posts/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            // console.log("pass", response.data);
              setPostsDataArray(response.data.data);
              stopLoading();
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
            stopLoading();
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
          stopLoading();
        }
      );
  }, [startLoading, stopLoading, showError, trigger]);

  console.log("posts", postsDataArray);

  const signout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="Home">
      <header>
        <h2>Your Feed</h2>
        <div className="header-buttons">
          <div className="user-other-buttons">
            <Link to="/newpost">
              <button className="new-post-btn">Add Post</button>
            </Link>
            {jwt_decode(localStorage.getItem("token")).role ? <Link to="/admin">
              <button className="new-post-btn">Check Reports</button>
            </Link> : null}
            <button onClick={signout} className="signout-btn">
              Signout
            </button>
          </div>
          <Link to="/userprofile">
            <div className="user-profile-button">
              <img src={userData.profilePhoto} alt="profile" />
              <p>{userData.username}</p>
            </div>
          </Link>
        </div>
      </header>
      <main>
        <PostsList postsDataArray={postsDataArray} trigger={trigger} setTrigger={setTrigger} />
      </main>
    </div>
  );
};

export default connect(mapStateToprops, mapDispatchToProps)(Home);
