const MovieDb = require("moviedb-promise");
require("dotenv").config();
const API_KEY = process.env.MOVIE_API_KEY;
const moviedb = new MovieDb(API_KEY),
    Review = require("../models/review");

exports.HomePage = async (req, res) => {
    try {
        var { page } = req.query,
            { search } = req.params;
        var obj = {};
        obj.page = page;
        if (search) {
            obj.query = search;
            moviedb.searchMovie(obj).then((movies) => {
                return res.render("movies-index", {
                    movies: movies.results,
                    page: page,
                    search,
                });
            });
        } else {
            moviedb.miscNowPlayingMovies(obj).then((movies) => {
                return res.render("movies-index", {
                    movies: movies.results,
                    page: page,
                });
            });
        }
    } catch (err) {
        req.flash("errs", { msg: "SERVER err" });
        res.redirect("/");
    }
};

exports.movieDetails = async (req, res) => {
    var {id} = req.params
    console.log({id}); 
    if(id[id.length -1]==`"`)id=id.slice(0,-1)
    console.log({id});
    Promise.all([
        moviedb.movieInfo({
            id
        }),
        moviedb.movieTrailers({
            id
        }),
        Review.find({
            movieId: id,
        }).sort("-date").lean(),
    ]).then((responses) => {
            const [movie, videos, reviews] = responses;
            movie.trailer_youtube_id = videos.youtube[0] && videos.youtube[0].source;
            res.render("movies-show", {
                movie: movie,
                reviews: reviews,
                usId: req.user._id,
            });
        })
        .catch((err) => {
            console.error(err);
            req.flash("errs", { msg: "SERVER err" });
            res.redirect("/");
        });
};

exports.createReview = async (req, res) => {
    req.body.userId = req.user._id;
    Review.create(req.body)
        .then((review) => {
            console.log({ msg: "Created a review successfully" });
            res.status(200).send(review);
        })
        .catch((err) => {
            console.log(err);
            req.flash("errs", { msg: "SERVER err" });
            res.redirect("/");
        });
};

exports.deleteReview = async (req, res) => {
    Promise.all([
        Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id }),
    ])
        .then((entries) => {
            [review] = entries;
            console.log("Deleted review");
            if (req.xhr) res.status(200).send(review);
            else res.redirect(`/movies/${review.movieId}"`);
        })
        .catch((err) => {
            console.error(err);
            req.flash("errs", { msg: "SERVER err" });
            res.redirect("/");
        });
};


exports.updateReview = async (req, res) => {
    Review.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body
    ).lean().then((review) => {
            console.log({ msg: "Updated", review });
            res.status(200).send(review);
        })
        .catch((err) => {
            console.error({msg:"err in updateReview ",err});
            req.flash("errs", { msg: "SERVER err" });
            res.redirect("/");
        });
};

exports.showReview = async (req, res) => {
    var {id} = req.params
    Promise.all([Review.findById(id).lean()])
        .then((entries) => {
            [review] = entries;
            console.log(review);
            res.render("reviews-show", {
                review: review,
                usID: req.user._id,
            });
        })
        .catch((err) => {
            console.error(err);
            req.flash("errs", { msg: "SERVER err" });
            res.redirect("/");
        });
};

exports.countandtotalReview = async (req, res) => {
    try {
        var {id} = req.query, data = {}
        console.log({id});
         var ratings = await Review.aggregate( [
            { $match: {  movieId: `${id}`} },
            { $group: { 
                _id:null,
                potatoRatings: { $sum: "$rating" },
                count: { $sum: 1 } } }
          ] );
          if(ratings[0]){
              delete ratings[0]._id
              data ={...ratings[0]}
              data.avg_rating = data.potatoRatings/data.count
            }else{
                data.error="No movie found"
                data.avg_rating=null;
            }
        return res.json(data)
    } catch (err) {
        console.error(err);
    }
};
module.exports = exports;

