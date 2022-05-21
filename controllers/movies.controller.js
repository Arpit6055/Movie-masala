const MovieDb = require("moviedb-promise");
require('dotenv').config();
const API_KEY = process.env.MOVIE_API_KEY;
const moviedb = new MovieDb(API_KEY)
, Review = require("../models/review");

exports.HomePage = async (req, res) => {
    try {
        var {page} = req.query,
        {search} = req.params;
        var obj={}
        obj.page=page
        if(search){
            obj.query=search
            moviedb.searchMovie(obj).then((movies) => {
                return res.render("movies-index", {
                    movies: movies.results,
                    page:page,
                    search
                });
            });
        }else{
            moviedb.miscNowPlayingMovies(obj).then((movies) => {
                return res.render("movies-index", {
                    movies: movies.results,
                    page:page,
                });
            });
        }
    } catch (error) {
        req.flash('errors', {msg:'SERVER ERROR'})
        res.redirect("/")
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
                usId: req.user._id
            });
        })
        .catch(err => {
            console.error(err);
            req.flash('errors', {msg:'SERVER ERROR'})
      res.redirect("/")
        });
};

exports.createReview = async (req,res)=>{
    req.body.userId = req.user._id
    Review.create(req.body)
    .then(review => {
        console.log({msg:"Created a review successfully"});
        res.status(200).send(review)
    })
    .catch(err => {
        console.log(err);
        req.flash('errors', {msg:'SERVER ERROR'})
        res.redirect("/")
    });
}

exports.deleteReview = async (req,res)=>{
    Promise.all([
         Review.findOneAndDelete({_id:req.params.id, userId:req.user._id}),
    ])
      .then(entries => {
          [review] = entries;
          console.log("Deleted review");
          if (req.xhr)
              res.status(200).send(review)
          else
              res.redirect(`/movies/${review.movieId}"`)
      })
      .catch(err => {
        console.error(err)
        req.flash('errors', {msg:'SERVER ERROR'})
        res.redirect("/")
      })
}

exports.updateReview = async (req, res) => {
    Review.findOneAndUpdate({_id:req.params.id, userId:req.user._id}, req.body, { new: true }).lean()
      .then(review => {
          console.log({msg:"Updated",review});
          res.status(200).send(review)
      })
      .catch(err => {
          console.error(err);
          req.flash('errors', {msg:'SERVER ERROR'})
    res.redirect("/")
      })
}

exports.showReview = async  (req, res) => {
    Promise.all([
        Review.findById(req.params.id).lean(),
    ])
    .then(entries => {
        [review] = entries;
        console.log(review);
        res.render('reviews-show', {
              review: review,
              usID : req.user._id
          })
      })
    .catch(err => {
        console.error(err);
        req.flash('errors', {msg:'SERVER ERROR'})
  res.redirect("/")
    })
}
module.exports = exports;
