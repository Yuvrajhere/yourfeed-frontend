export const initialState = {
  loading: false,
  error: "",
  homeFeedPostsData: [],
  userProfileData: [],
  userPostsData: [],
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING_ON": {
      return {
        ...state,
        loading: true,
      };
    }

    case "LOADING_OFF": {
      return {
        ...state,
        loading: false,
      };
    }

    case "REMOVE_ERROR": {
      return {
        ...state,
        error: "",
      };
    }

    case "SHOW_ERROR": {
      return {
        ...state,
        error: action.payload
      }
    }

    default: {
     // console.log("default reached");
      return state;
    }
  }
};
