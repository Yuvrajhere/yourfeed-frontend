import "./PostsList.css";
import Post from "../Post";

const PostsList = props => {

  return (
    <div className="Postslist">
      {
        props.postsDataArray.map(postData => {
          return <Post postData={postData} key={postData.id} trigger={props.trigger} setTrigger={props.setTrigger}/>
        })
      }
    </div>
  );
};

export default PostsList;