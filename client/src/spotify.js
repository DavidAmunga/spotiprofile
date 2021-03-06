import axios from 'axios';
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

// Map to retrieve localstorage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to Homepage
  window.location = window.location.origin;
};

/**
 * Checks if the Amount of Time that has elasped between timestamp in localStorage
 * and now is greater than the expireation time of 3600 seconds (1 Hour)
 * @returns {boolean} Whether or not accessToken in localStorage has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;

  if (!accessToken || !timestamp) {
    return false;
  }

  const millisecondsElasped = Date.now() - Number(timestamp);
  return millisecondsElasped / 1000 > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the refresh_token endpoint in our
 * Node App , then update values in localStorage with data from response
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error('No refresh token available');
      logout();
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    );

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token,
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Handles logic for retrieving the Spotify Access Token from localStorage
 * or URL query params
 * @returns {string} A Spotify Access Token
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  };
  const hasError = urlParams.get('error');

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === 'undefined'
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== 'undefined'
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // We should never get here!
  return false;
};

export const accessToken = getAccessToken();

/**
 * Axios Global Defaults
 */
axios.defaults.baseURL = `https://api.spotify.com/v1`;
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = `application/json`;

/**
 * Get Current Users Profile
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUsersProfile = () => axios.get(`/me`);

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-list-of-current-users-playlists
 * @returns {Promise}
 */

export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a Users Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param {string} time_range -  Over what time frame the affinities are computed. Valid values
 *  long_term (calculated from several years of data and including all new data as it becomes available),
 *  medium_term (approximately last 6 months),
 *  short_term (approximately last 4 weeks).
 *  Default: medium_term
 * @returns {Promise}
 */
export const getCurrentUserTopArtists = (time_range = 'short_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

/**
 * Get a Users Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param {string} time_range -  Over what time frame the affinities are computed. Valid values
 *  long_term (calculated from several years of data and including all new data as it becomes available),
 *  medium_term (approximately last 6 months),
 *  short_term (approximately last 4 weeks).
 *  Default: medium_term
 * @returns {Promise}
 */
export const getCurrentUserTopTracks = (time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};

/**
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist
 * @returns {Promise}
 */
export const getPlaylistById = (playlist_id) => {
  return axios.get(`/playlists/${playlist_id}`);
};

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
 * @param {string} - A Comma separated list of the spotify ID's for the tracks
 * @returns {Promise}
 */
export const getAudioFeaturesForTracks = (ids) => {
  return axios.get(`/audio-features?ids=${ids}`);
};
