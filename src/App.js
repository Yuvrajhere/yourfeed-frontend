import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Loading  from "./components/Loading";
import Error from "./components/Error";
import UserProfile from "./components/UserProfile";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import PostForm from "./components/PostForm";
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";
import AdminRoute from "./Routes/AdminRoute";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AdminPage from "./components/AdminPage";
import UnknownPage from "./components/UnknownPage";

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error
  };
}

const App = props => {
  return (
    <Router>
      <div className="App">
        {props.loading ? <Loading /> : null}
        {props.error.length > 0 ? <Error /> : null}
        <Switch>
          <PublicRoute component={Signup} path="/signup" exact />
          <PublicRoute component={Signin} path="/signin" exact />
          <AdminRoute component={AdminPage} path="/admin" exact />
          <PrivateRoute component={UserProfile} path="/userprofile" exact />
          <PrivateRoute component={PostForm} path="/newpost" exact />
          <PrivateRoute component={Profile} path="/user/:id" exact />
          <PrivateRoute component={Home} path="/" exact />
          <Route component={UnknownPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default connect(mapStateToProps, null)(App);
