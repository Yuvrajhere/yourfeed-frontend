import "./Profile.css";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { showError, startLoading, stopLoading } from "../../actions";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import PostsList from "../PostsList";
import userPlaceholderImage from "../../assets/user_placeholder.png";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError: showError,
  startLoading: startLoading,
  stopLoading: stopLoading,
};

const Profile = (props) => {
  let history = useHistory();

  let { id } = useParams();

  const [userDetails, setUserDetails] = useState({
    username: "",
    profilePhoto: "",
    posts_count: "",
  });

  const [postsDataArray, setPostsDataArray] = useState([]);

  const { startLoading, stopLoading, showError } = props;

  useEffect(() => {
    startLoading();
    axios
      .get(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            if (response.data.data.profile_photo === null) {
              setUserDetails({
                ...userDetails,
                username: response.data.data.username,
                profilePhoto: userPlaceholderImage,
                posts_count: response.data.data.posts_count,
              });
            } else {
              setUserDetails({
                ...userDetails,
                username: response.data.data.username,
                profilePhoto:
                  "data:image/jpeg;base64," +
                  new Buffer(
                    response.data.data.profile_photo,
                    "binary"
                  ).toString("base64"),
                posts_count: response.data.data.posts_count,
              });
            }
            stopLoading();
          } else {
            console.log("failed", response.data.message);
            showError(response.data.message);
            history.push("/");
            stopLoading();
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
          history.push("/signin");
          stopLoading();
        }
      );
  }, [startLoading, stopLoading, showError]);

  useEffect(() => {
    startLoading();
    axios
      .get(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
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
  }, [id, startLoading, stopLoading, showError]);

  return (
    <div className="Profile">
      <main>
        <img
          className="profile-image"
          src={userDetails.profilePhoto}
          alt="profile"
        />
        <div className="user-details">
          <h1>{userDetails.username}</h1>
          <p>
            {userDetails.posts_count}{" "}
            {userDetails.posts_count === 1 ? "post" : "posts"}
          </p>
        </div>
      </main>
      <div className="posts">
        {postsDataArray.length > 0 ? (
          <PostsList postsDataArray={postsDataArray} />
        ) : (
          <div className="no-posts-div">
            <h2>This user havent posted anything yet!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
