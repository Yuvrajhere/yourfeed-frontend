import { useState, useEffect } from "react";
import "./PostForm.css";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { showError, startLoading, stopLoading } from "../../actions";
import axios from "axios";
import moment from "moment-timezone";
import jwt_decode from "jwt-decode";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError,
  startLoading,
  stopLoading,
};

const PostForm = (props) => {
  const history = useHistory();

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    artistName: "",
    artistContentLink: "",
    category: "",
    postImagePath: "",
    postImage: "",
  });

  const [categoriesArray, setCategoriesArray] = useState([]);

  useEffect(() => {
    props.startLoading();
    axios
      .get(`http://localhost:5000/api/categories/`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success && response.data.results.length > 0) {
            console.log("pass", response.data);
            setCategoriesArray(response.data.results);
            props.stopLoading();
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.stopLoading();
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.stopLoading();
          props.showError("Error occured in loading data");
        }
      );
  }, []);

  const handleInputChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputFileChange = (e) => {
    console.log("changing");
    setPostData({
      ...postData,
      postImagePath: e.target.value,
      postImage: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.startLoading();

    const data = {
      postedByUserId: jwt_decode(localStorage.getItem("token")).result,
      categoryId: postData.category,
      artistName: postData.artistName,
      artistContentLink: postData.artistContentLink,
      title: postData.title,
      description: postData.description,
      likesCount: 0,
      commentsCount: 0,
      reportsCount: 0,
      postedDate: moment().tz("Asia/Kolkata").format(),
    };

    // const data = new FormData();
    // data.append("postedByUserId", jwt_decode(localStorage.getItem("token")).result);
    // data.append("categoryId", postData.category);
    // data.append("artistName", postData.artistName);
    // data.append("artistContentLink", postData.artistContentLink);
    // data.append("title", postData.title);
    // data.append("description", postData.description);
    // data.append("likesCount", 0);
    // data.append("commentsCount", 0);
    // data.append("reportsCount", 0);
    // data.append("postedDate", moment().tz("Asia/Kolkata").format());

    axios
      .post(`http://localhost:5000/api/posts/`, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            if (postData.postImagePath) {
              const imageData = new FormData();
              imageData.append("id", response.data.results.insertId);
              imageData.append("image", postData.postImage);
              axios
                .patch(`http://localhost:5000/api/posts/`, imageData, {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(
                  (response) => {
                    if (response.data.success) {
                      history.push("/");
                      window.location.reload();
                      props.stopLoading();
                      props.showError("Post uploaded");
                    } else {
                      // console.log("image failed", response.data.message);
                      props.stopLoading();
                      props.showError(response.data.message);
                      axios.delete(
                        `http://localhost:5000/api/posts/${response.data.results.insertId}`
                      );
                      // .then(
                      //   (response) => console.log(response),
                      //   (error) => console.log(error)
                      // );
                      return;
                    }
                  },
                  (error) => {
                    // console.log("Error", error);

                    axios.delete(
                      `http://localhost:5000/api/posts/${response.data.results.insertId}`
                    );
                    // .then(
                    //   (response) => console.log(response),
                    //   (error) => console.log(error)
                    // );
                    props.stopLoading();
                    props.showError("Unable to send request");
                    return;
                  }
                );
            } else {
              history.push("/");
              window.location.reload();
              props.stopLoading();
              props.showError("Post uploaded");
            }
          } else {
            // console.log("failed", response.data.message);
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
    <div className="PostForm">
      <h2>Upload new post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-child">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter title here"
            minLength="10"
            maxLength="30"
            required
            name="title"
            value={postData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-child">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter description here"
            minLength="20"
            maxLength="150"
            required
            name="description"
            value={postData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="form-child">
          <label htmlFor="artist-name">Artist name</label>
          <input
            type="text"
            id="artist-name"
            placeholder="Enter Artist's name here"
            minLength="3"
            maxLength="30"
            required
            name="artistName"
            value={postData.artistName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-child">
          <label htmlFor="artist-content-link">Artist content link</label>
          <input
            type="text"
            id="artist-content-link"
            placeholder="Enter Artist's content link here"
            minLength="5"
            maxLength="60"
            required
            name="artistContentLink"
            value={postData.artistContentLink}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-child">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            required={true}
            name="category"
            value={postData.category}
            onChange={handleInputChange}
          >
            <option value="">select category</option>
            {categoriesArray.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-child">
          <label htmlFor="post-image">Post related Image (optional)</label>
          <input
            id="post-image"
            type="file"
            accept="image/jpeg"
            name="postImage"
            value={postData.postImagePath}
            onChange={handleInputFileChange}
          />
        </div>
        <input className="submit-button" type="submit" value="upload" />
      </form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
