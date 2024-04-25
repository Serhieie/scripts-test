const messageList = {
  400: "Bad Request: The server cannot process the request due to a client error.",
  401: "Unauthorized: Access to the requested resource is unauthorized.",
  403: "Forbidden: The server refuses to authorize the request.",
  404: "Not Found: The requested resource could not be found on the server.",
  409: "Conflict: Email already in use.",
};

const HttpError = (status, message = messageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
