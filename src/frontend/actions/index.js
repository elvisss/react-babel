import axios from 'axios';

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => {
  return (dispatch) => {
    axios
      .post('/auth/sign-up', payload)
      .then(({ data }) => dispatch(registerRequest(data)))
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => dispatch(setError(err)));
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispatch) => {
    axios({
      url: '/auth/sign-in',
      method: 'post',
      auth: {
        username: email,
        password,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `name=${data.user.name}`;
        document.cookie = `id=${data.user.id}`;
        dispatch(loginRequest(data.user));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => dispatch(setError(err)));
  };
};

export const setFavoriteRequest = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const setFavorite = ({
  _id,
  cover,
  title,
  year,
  contentRating,
  duration,
}) => {
  return (dispatch) => {
    axios({
      url: '/user-movies',
      method: 'POST',
      data: {
        movieId: _id,
      },
    })
      .then(() => {
        dispatch(
          setFavoriteRequest({
            _id,
            cover,
            title,
            year,
            contentRating,
            duration,
          }),
        );
      })
      .catch((err) => dispatch(setError(err)));
  };
};

export const deleteFavoriteRequest = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const deleteFavorite = (userMovieId) => {
  return (dispatch) => {
    axios({
      url: `/user-movies/${userMovieId}`,
      method: 'DELETE',
    })
      .then(() => {
        dispatch(deleteFavoriteRequest(userMovieId));
      })
      .catch((err) => dispatch(setError(err)));
  };
};
