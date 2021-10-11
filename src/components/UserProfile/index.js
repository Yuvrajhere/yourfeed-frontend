import userPlaceholderImage from "../../assets/user_placeholder.png";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./UserProfile.css";
import { connect } from "react-redux";
import { showError, startLoading, stopLoading } from "../../actions";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Loading from "../Loading";
import PostsList from "../PostsList";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError: showError,
  startLoading: startLoading,
  stopLoading: stopLoading,
};

const UserProfile = (props) => {
  let history = useHistory();

  const [userDetails, setUserDetails] = useState({
    isLoadingOn: true,
    username: "",
    profilePhoto: "",
    posts_count: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [newImageData, setNewImageData] = useState({
    imagePath: "",
    image: "",
  });

  const [postsDataArray, setPostsDataArray] = useState([]);

  const { startLoading, stopLoading, showError } = props;

  const [trigger, setTrigger] = useState(false);


  const handleSignOut = (e) => {
    e.preventDefault();
    props.startLoading();
    localStorage.removeItem("token");
    props.stopLoading();
    window.location.reload(true);
  };

  const setEditingFalse = (e) => {
    setIsEditing(false);
  };

  const setEditingTrue = (e) => {
    setIsEditing(true);
  };

  useEffect(() => {
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
              setUserDetails((prevUserDetails) => {
                return {
                  ...prevUserDetails,
                  isLoadingOn: false,
                  username: response.data.data.username,
                  posts_count: response.data.data.posts_count,
                  profilePhoto: userPlaceholderImage,
                };
              });
            } else {
              setUserDetails((prevUserDetails) => {
                return {
                  ...prevUserDetails,
                  isLoadingOn: false,
                  username: response.data.data.username,
                  posts_count: response.data.data.posts_count,
                  profilePhoto:
                    "data:image/jpeg;base64," +
                    new Buffer(
                      response.data.data.profile_photo,
                      "binary"
                    ).toString("base64"),
                };
              });
            }
          } else {
            console.log("failed", response.data.message);
            setUserDetails((prevUserDetails) => {
              return {
                ...prevUserDetails,
                isLoadingOn: false,
              };
            });
            localStorage.removeItem("token");
            showError(response.data.message);
            history.push("/signin");
          }
        },
        (error) => {
          console.log("Error", error);
          setUserDetails((prevUserDetails) => {
            return {
              ...prevUserDetails,
              isLoadingOn: false,
            };
          });
          localStorage.removeItem("token");
          showError("Error occured in loading data");
          history.push("/signin");
        }
      );
  }, [showError, history]);

  useEffect(() => {
    startLoading();
    axios
      .get(
        `http://localhost:5000/api/posts/${
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
  }, [startLoading, stopLoading, showError, trigger]);

  const handleInputFileChange = (e) => {
    setNewImageData({
      ...newImageData,
      imagePath: e.target.value,
      image: e.target.files[0],
    });
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    props.startLoading();
    console.log(newImageData);
    const data = new FormData();
    data.append("id", jwt_decode(localStorage.getItem("token")).result);
    data.append("profile_photo", newImageData.image);
    axios
      .patch(`http://localhost:5000/api/users/profile_photo`, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            setIsEditing(false);
            window.location.reload(true);
            props.stopLoading();
          } else {
            console.log("failed", response.data.message);
            props.stopLoading();
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          props.stopLoading();
          props.showError("Unable to send request");
        }
      );
  };

  const removeProfileImage = (e) => {
    e.preventDefault();
    console.log("hallo");
    axios
      .patch(
        `http://localhost:5000/api/users/remove_profile_photo`,
        {
          id: jwt_decode(localStorage.getItem("token")).result,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            setIsEditing(false);
            window.location.reload(true);
            props.stopLoading();
          } else {
            console.log("failed", response.data.message);
            props.stopLoading();
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          props.stopLoading();
          props.showError("Unable to send request");
        }
      );
  };

  return (
    <div className="UserProfile">
      {!userDetails.isLoadingOn ? (
        <>
          <main>
            {isEditing ? (
              <div className="image-edit">
                <div className="image-edit-options">
                  <p onClick={removeProfileImage} className="remove-image">
                    Remove Image
                  </p>
                  <div className="image-uploader">
                    <p>Change image</p>
                    <form onSubmit={handleImageSubmit}>
                      <input
                        type="file"
                        accept="image/jpeg"
                        required
                        value={newImageData.imagePath}
                        onChange={handleInputFileChange}
                      />
                      <br />
                      <input type="submit" value="Upload" />
                    </form>
                  </div>
                </div>
                <div className="close-edit-btn-div">
                  <p onClick={setEditingFalse} className="close-edit-btn">
                    X
                  </p>
                </div>
              </div>
            ) : null}
            <img
              className="actual-profile-image"
              src={userDetails.profilePhoto}
              alt="profile"
            />
            <img
              onClick={setEditingTrue}
              className="edit-icon-image"
              src="https://img.favpng.com/25/8/16/computer-icons-scalable-vector-graphics-portable-network-graphics-svg-edit-png-favpng-Gn6gRhJPMExzAJ7JzV8ttfxjh.jpg"
              alt="profile"
            />
            {!isEditing ? (
              <div className="user-details">
                <h1>{userDetails.username}</h1>
                <p>
                  {userDetails.posts_count}{" "}
                  {userDetails.posts_count === 1 ? "post" : "posts"}
                </p>
                <div className="profile-btns">
                  <button className="new-post-btn">
                    <Link to="/newpost">Add Post</Link>
                  </button>
                  <button onClick={handleSignOut} className="signout-btn">
                    Signout
                  </button>
                </div>
              </div>
            ) : null}
          </main>
          <div className="posts">
            {postsDataArray.length > 0 ? (
              <PostsList setTrigger={setTrigger} trigger={trigger} postsDataArray={postsDataArray} />
            ) : (
              <div className="no-posts-div">
                <h2>You havent posted anything yet!</h2>
                <p>Want to post now?</p>
                <Link to="/newpost">
                  <button className="submit-button">Add Post</button>
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
