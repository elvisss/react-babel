/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';

import helment from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import axios from 'axios';
import boom from '@hapi/boom';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import Layout from '../frontend/components/Layout';
import getManifest from './getManifest';

dotenv.config();

const THIRTY_DAYS_IN_SEC = 2592000000;
const TWO_HOURS_IN_SEC = 7200000;

const { ENV, PORT } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

if (ENV === 'development') {
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = { port: PORT, hot: true };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helment());
  app.use(helment.permittedCrossDomainPolicies());
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'main.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${mainStyles}" rel="stylesheet">
      <title>ReactVideo</title>
    </head>
    <body>
      <div id="app">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          '\\u003c',
        )}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
      <script src="${vendorBuild}" type="text/javascript"></script>
    </body>
  </html>`;
};

const renderApp = async (req, res) => {
  let initialState;
  const { email, name, id, token } = req.cookies;

  try {
    let movieList = await axios({
      url: `${process.env.API_URL}/api/movies`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    movieList = movieList.data.data;

    let userMovieList = await axios({
      url: `${process.env.API_URL}/api/user-movies/?userId=${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userMovieList = userMovieList.data.data;

    initialState = {
      user: {
        email,
        name,
        id,
      },
      playing: {},
      myList: movieList.filter((movie) => {
        return userMovieList.some(
          (userMovie) => movie._id === userMovie.movieId,
        );
      }).map((movie) => {
        const filteredMovie = userMovieList.find((userMovie) => movie._id === userMovie.movieId);
        if (filteredMovie) {
          // eslint-disable-next-line no-param-reassign
          movie.userMovieId = filteredMovie._id;
        }
        return movie;
      }),
      trends: movieList.filter(
        (movie) => movie.contentRating === 'PG' && movie._id,
      ),
      originals: movieList.filter(
        (movie) => movie.contentRating === 'G' && movie._id,
      ),
    };
  } catch (err) {
    initialState = {
      user: {},
      playing: {},
      myList: [],
      trends: [],
      originals: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = initialState.user.id;
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <Layout>{renderRoutes(serverRoutes(isLogged))}</Layout>
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } = req.body;

  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: ENV === 'production',
          secure: ENV === 'production',
          maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC,
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async (req, res, next) => {
  const { body: userMovie } = req;
  const { id, token } = req.cookies;
  try {
    const response = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: id,
        movieId: userMovie.movieId,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
  const { userMovieId } = req.params;
  const { token } = req.cookies;

  try {
    const response = await axios({
      url: `${process.env.API_URL}/api/user-movies/${userMovieId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) throw new Error(err);
  console.log(`Server running in mode ${ENV} on port ${PORT}`);
});
