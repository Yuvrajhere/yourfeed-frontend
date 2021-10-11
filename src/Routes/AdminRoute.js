import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") &&
        localStorage.getItem("token").length > 0 &&
        jwt_decode(localStorage.getItem("token")).role ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default AdminRoute;
