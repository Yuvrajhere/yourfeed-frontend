export const startLoading = () => {
  return {
    type: "LOADING_ON",
  }
}

export const stopLoading = () => {
  return {
    type: "LOADING_OFF",
  }
}

export const showError = (message) => {
  return {
    type: "SHOW_ERROR",
    payload: message
  }
}

export const removeError = (data) => {
  return {
    type: "REMOVE_ERROR",
  }
}

export const signin = (data, history) => {
  const payload = {
    data: data,
    history: history
  }
  return {
    type: "SIGNIN",
    payload: payload
  }
}
