import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Search movies
export const searchMovies = async (query, page = 1) => {
  const res = await API.get(`/movies/search?query=${query}&page=${page}`);
  return res.data;
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  const res = await API.get(`/movies/popular?page=${page}`);
  return res.data;
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  const res = await API.get(`/movies/top-rated?page=${page}`);
  return res.data;
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  const res = await API.get(`/movies/upcoming?page=${page}`);
  return res.data;
};

// Get movie details
export const getMovieDetails = async (id) => {
  const res = await API.get(`/movies/${id}`);
  return res.data;
};

// Get genres
export const getGenres = async () => {
  const res = await API.get('/movies/genres');
  return res.data;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  const res = await API.get(`/movies/genre/${genreId}?page=${page}`);
  return res.data;
};