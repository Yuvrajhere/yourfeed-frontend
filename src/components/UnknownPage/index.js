import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./UnknownPage.css";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {};

const UnknownPage = (props) => {
  return (
    <div className="UnknownPage">
      <h1>Error 404, Page not found!</h1>
      <Link to="/">
        <button className="submit-button">Go back to main page</button>
      </Link>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UnknownPage);
