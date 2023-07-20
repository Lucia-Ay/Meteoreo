'use strict';

import { updateWeather, error404 } from './app';

const defaultLocation = '#/weather?lat=41.015137&lon=28.979530'; // Istanbul

const currentLocation = () => {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (err) => {
      window.location.hash = defaultLocation;
    }
  );
};

const searchedLocation = (query) => updateWeather(...query.split('&'));

const routes = new Map([
  ['#/current-location', currentLocation],
  ['#/weather', searchedLocation],
]);

const checkHash = () => {
  const requestedURL = window.location.hash.slice(1);
  const [route, query] = requestedURL.includes
    ? requestedURL.split('?')
    : [requestedURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener('hashchange', checkHash);
window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.location.hash = '#/current-location';
  } else {
    checkHash();
  }
});
