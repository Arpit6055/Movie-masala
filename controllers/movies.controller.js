const MovieDb = require("moviedb-promise");
require('dotenv').config();
const API_KEY = process.env.MOVIE_API_KEY;
const moviedb = new MovieDb(API_KEY)
, Review = require("../models/review"),
Comment = require('../models/comment');

exports.HomePage = async (req, res) => {
    try {
        var {page} = req.query;
        console.log({page});
        moviedb.miscNowPlayingMovies({ page: page }).then((movies) => {
            res.render("movies-index", {
                movies: movies.results,
                page:page,
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "SERVER ERROR" });
    }
};

exports.movieDetails = async (req, res) => {
    Promise.all([
        moviedb.movieInfo({
            id: req.params.id,
        }),
        moviedb.movieTrailers({
            id: req.params.id,
        }),
        Review.find({
            movieId: req.params.id,
        })
            .sort("-date")
            .lean(),
    ])
        .then((responses) => {
            const [movie, videos, reviews] = responses;
            movie.trailer_youtube_id = videos.youtube[0] && videos.youtube[0].source;
            res.render("movies-show", {
                movie: movie,
                reviews: reviews,
                myId: req.user._id
            });
        })
        .catch(console.error);
};

exports.createReview = async (req,res)=>{
    req.body.userId = req.user._id
    Review.create(req.body)
    .then(review => {
        console.log({msg:"Created a review successfully"});
        res.status(200).send(review)
    })
    .catch(err => {
        console.error(err);
        res.status(400).send(err);
    });
}

exports.deleteReview = async (req,res)=>{
    Promise.all([
        Review.findByIdAndRemove(req.params.id),
        Comment.deleteMany({ reviewId: req.params.id })
    ])
      .then(entries => {
          [review, comments] = entries;
          console.log("Deleted review");
          if (req.xhr)
              res.status(200).send(review)
          else
              res.redirect(`/movies/${review.movieId}"`)
      })
      .catch(err => {
          console.error(err)
          res.status(400).send(err);
      })
}
module.exports = exports;
