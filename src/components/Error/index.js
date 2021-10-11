import { connect } from "react-redux";
import { removeError } from "../../actions/index";
import "./Error.css";

const mapStateToProps = (state) => {
  return {
    error: state.error,
  };
};

const mapDispatchToProps = {
  removeError: removeError
}

const Error = (props) => {

  const handleClick = e => {
    e.preventDefault();
    props.removeError();
  }

  return (
    <div className="Error">
      <div className="error-box">
        <p>{props.error}</p>
        <button onClick={handleClick}>OK</button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Error);
