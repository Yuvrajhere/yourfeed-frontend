import { useEffect, useState } from "react";
import "./Post.css";
import userPlaceHolderImage from "../../assets/user_placeholder.png";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { startLoading, stopLoading, showError } from "../../actions";
import moment from "moment-timezone";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError,
  startLoading,
  stopLoading,
};

const Post = (props) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const [isPostLiked, setIsPostLiked] = useState(false);

  const [isPostReported, setIsPostReported] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [isEditedComment, setIsEditedComment] = useState(false);

  const [editCommentData, setEditCommentData] = useState({});

  const [previewCommentsArray, setPreviewCommentsArray] = useState([]);

  const [commentsArray, setCommentsArray] = useState([]);

  const { showError, postData } = props;

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/likes/checklike/${postData.id}/${
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
            // console.log("pass", response.data);
            if (response.data.results.length > 0) {
              setIsPostLiked(response.data.results);
            }
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
        }
      );
  }, [showError, postData]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/reports/checkreport/${postData.id}/${
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
            // console.log("pass", response.data);
            if (response.data.results.length > 0) {
              setIsPostReported(true);
            }
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
        }
      );
  }, [showError, postData]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/comments/preview/${postData.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            // console.log("pass", response.data);
            if (response.data.results.length > 0) {
              setPreviewCommentsArray(response.data.results);
            }
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
        }
      );
  }, [props.trigger, showError, postData]);

  const likePost = () => {
    const data = {
      post_id: props.postData.id,
      liked_by_user_id: jwt_decode(localStorage.getItem("token")).result,
      liked_date: moment().tz("Asia/Kolkata").format(),
    };
    axios
      .post(`http://localhost:5000/api/likes/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            setIsPostLiked(true);
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const dislikePost = () => {
    axios
      .delete(
        `http://localhost:5000/api/likes/${props.postData.id}/${
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
            setIsPostLiked(false);
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const reportPost = () => {
    const data = {
      post_id: props.postData.id,
      reported_by_user_id: jwt_decode(localStorage.getItem("token")).result,
      reported_date: moment().tz("Asia/Kolkata").format(),
    };
    axios
      .post(`http://localhost:5000/api/reports/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            setIsPostReported(true);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const handleCommentInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const data = {
      post_id: props.postData.id,
      comment_by_user_id: jwt_decode(localStorage.getItem("token")).result,
      comment_text: commentText,
      comment_date: moment().tz("Asia/Kolkata").format(),
    };
    axios
      .post(`http://localhost:5000/api/comments/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            if (props.postData.comments_count > 1) {
              showComments();
            }
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
    setCommentText("");
  };

  const handleEditCommentSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...editCommentData,
      comment_text: commentText,
      comment_date: moment().tz("Asia/Kolkata").format(),
    };
    axios
      .put(`http://localhost:5000/api/comments/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            if (props.postData.comments_count > 1) {
              showComments();
            }
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
    setCommentText("");
    setEditCommentData({});
    setIsEditedComment(false);
  };

  const showComments = () => {
    axios
      .get(`http://localhost:5000/api/comments/${props.postData.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            if (response.data.results.length > 0) {
              setCommentsArray(response.data.results);
              setIsCommentsOpen(true);
            }
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const hideComments = () => {
    setIsCommentsOpen(false);
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            if (props.postData.comments_count > 1) {
              showComments();
            }
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const deletePost = () => {
    axios
      .delete(`http://localhost:5000/api/posts/${props.postData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  };

  const approvePost = () => {
    axios
      .delete(`http://localhost:5000/api/reports/${props.postData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            console.log("pass", response.data);
            props.setTrigger(!props.trigger);
          } else {
            console.log("failed", response.data.message);
            localStorage.removeItem("token");
            props.showError(response.data.message);
          }
        },
        (error) => {
          console.log("Error", error);
          localStorage.removeItem("token");
          props.showError("Error occured in loading data");
        }
      );
  }

  const editComment = (comment) => {
    setCommentText(comment.comment_text);
    setIsEditedComment(true);
    setEditCommentData(comment);
    props.setTrigger(!props.trigger);
    // console.log(comment)
  };

  return (
    <div className="Post">
      <div className="head">
        <Link
          to={
            props.postData.user_id ===
            jwt_decode(localStorage.getItem("token")).result
              ? `/userprofile`
              : `/user/${props.postData.user_id}`
          }
        >
          <div className="user">
            <img
              src={
                props.postData.profile_photo
                  ? "data:image/jpeg;base64," +
                    new Buffer(props.postData.profile_photo, "binary").toString(
                      "base64"
                    )
                  : userPlaceHolderImage
              }
              alt={props.postData.username}
            />
            <p className="username">{props.postData.username}</p>
          </div>
        </Link>
        <p className="category">{props.postData.category_name}</p>
      </div>
      <div className="post-body">
        <div className="post-text">
          <div>
            <h2 className="title">{props.postData.title}</h2>
            <a
              href={props.postData.artist_content_link}
              target="_blank"
              rel="noopener noreferrer"
              className="artist"
            >
              {props.postData.artist_name}
            </a>
          </div>
          <p className="post-description">{props.postData.description}</p>
        </div>
        {props.postData.image ? (
          <div className="post-media">
            <img
              src={
                "data:image/jpeg;base64," +
                new Buffer(props.postData.image, "binary").toString("base64")
              }
              alt="haha"
            />
          </div>
        ) : null}
      </div>
      <div className="post-end">
        <div className="react">
          <p>
            {props.postData.likes_count}{" "}
            {props.postData.likes_count === 1 ? "like" : "likes"}
          </p>
          {isPostLiked ? (
            <p onClick={dislikePost}>
              <i className="fas fa-thumbs-up"></i>
            </p>
          ) : (
            <p onClick={likePost}>
              <i className="far fa-thumbs-up"></i>
            </p>
          )}

          {jwt_decode(localStorage.getItem("token")).result ===
          props.postData.user_id ? null : isPostReported ? (
            <p id="reported-message">
              <i className="fas fa-flag"></i>
              <span> - Reported by you</span>
            </p>
          ) : (
            <p onClick={reportPost}>
              <i className="far fa-flag"></i>
            </p>
          )}
        </div>
        <p>
          {new Date(props.postData.posted_date).toTimeString().slice(0, 5)}
          {" - "}
          {new Date(props.postData.posted_date).toDateString()}
        </p>
      </div>
      {props.postData.comments_count > 0 ? (
        <div className="comment-section">
          {isCommentsOpen ? (
            <div className="comments">
              <div>
                <h4>Comments</h4>
                <p onClick={hideComments}>close</p>
              </div>
              <div className="comment-list">
                {commentsArray.map((comment) => {
                  return (
                    <div key={comment.id} className="comment">
                      <div>
                        <p>{comment.username}</p>
                        <p>{comment.comment_text}</p>
                      </div>
                      <div>
                        {comment.comment_by_user_id ===
                          jwt_decode(localStorage.getItem("token")).result ||
                        props.postData.user_id ===
                          jwt_decode(localStorage.getItem("token")).result ? (
                          <i
                            onClick={() => deleteComment(comment.id)}
                            className="fas fa-trash-alt"
                          ></i>
                        ) : null}
                        {comment.comment_by_user_id ===
                        jwt_decode(localStorage.getItem("token")).result ? (
                          <i
                            onClick={() => editComment(comment)}
                            className="far fa-edit"
                          ></i>
                        ) : null}
                        <p>
                          {new Date(comment.comment_date)
                            .toTimeString()
                            .slice(0, 5)}
                          {" - "}
                          {new Date(comment.comment_date).toDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {props.postData.comments_count > 2 ? (
                <p className="show-comments" onClick={showComments}>
                  View all {props.postData.comments_count} comments
                </p>
              ) : null}
              {previewCommentsArray.map((comment) => {
                return (
                  <div key={comment.id} className="comment preview-comment">
                    <div>
                      <p>{comment.username}</p>
                      <p>{comment.comment_text}</p>
                    </div>
                    <div>
                      {comment.comment_by_user_id ===
                        jwt_decode(localStorage.getItem("token")).result ||
                      props.postData.user_id ===
                        jwt_decode(localStorage.getItem("token")).result ? (
                        <i
                          onClick={() => deleteComment(comment.id)}
                          className="fas fa-trash-alt"
                        ></i>
                      ) : null}
                      {comment.comment_by_user_id ===
                      jwt_decode(localStorage.getItem("token")).result ? (
                        <i
                          onClick={() => editComment(comment)}
                          className="far fa-edit"
                        ></i>
                      ) : null}
                      <p>
                        {new Date(comment.comment_date)
                          .toTimeString()
                          .slice(0, 5)}
                        {" - "}
                        {new Date(comment.comment_date).toDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : null}
      <div className="comment-box">
        <form
          onSubmit={
            isEditedComment ? handleEditCommentSubmit : handleCommentSubmit
          }
        >
          <input
            value={commentText}
            onChange={handleCommentInputChange}
            placeholder="Add a comment"
            required
            minLength="1"
            maxLength="60"
          />
          <div className="comment-btns">
            {isEditedComment ? (
              <input
                onClick={(e) => {
                  e.preventDefault();
                  setEditCommentData({});
                  setCommentText("");
                  setIsEditedComment(false);
                }}
                type="submit"
                value="Cancel   | "
              />
            ) : null}
            <input type="submit" value="Post" />
          </div>
        </form>
      </div>
      {window.location.pathname === "/admin" ? (
        <div className="admin-options">
          <p>Reported Count : {props.postData.reports_count}</p>
          <div className="admin-btns">
            <i onClick={approvePost} className="fas fa-check-circle"></i>
            <i onClick={deletePost} className="fas fa-trash-alt"></i>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
