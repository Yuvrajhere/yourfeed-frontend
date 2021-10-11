import "./AdminPage.css";
import PostsList from "../PostsList";
import { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { showError, startLoading, stopLoading } from "../../actions";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  showError,
  startLoading,
  stopLoading,
};

const AdminPage = (props) => {
  const [postsDataArray, setPostsDataArray] = useState([]);

  const [trigger, setTrigger] = useState(false);

  const { startLoading, stopLoading, showError } = props;

  useEffect(() => {
    startLoading();
    axios
      .get(`http://localhost:5000/api/posts/reported`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            // console.log("posts pass", response.data);
            setPostsDataArray(response.data.data);
            stopLoading();
          } else {
            // console.log("failed", response.data.message);
            localStorage.removeItem("token");
            showError(response.data.message);
            stopLoading();
          }
        },
        (error) => {
          // console.log("Error", error);
          localStorage.removeItem("token");
          showError("Error occured in loading data");
          stopLoading();
        }
      );
  }, [trigger, startLoading, stopLoading, showError]);

  return (
    <div className="AdminPage">
      <header>
        <h3>Reported Posts</h3>
        <p>count : {postsDataArray.length}</p>
      </header>

      {postsDataArray.length > 0 ? (
        <main>
          <PostsList
            postsDataArray={postsDataArray}
            trigger={trigger}
            setTrigger={setTrigger}
          />
        </main>
      ) : (
        <div className="no-posts-div">
          <h2>No reported posts for now!</h2>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
