const router = require('express').Router(),
Joi = require("joi"),
validateRequest = require('../config/validate-request'),
movies = require('../controllers/movies.controller'),
{ensureAuthenticated } = require("../config/auth");


function homepageSchema(req, res, next) {
    const schema = Joi.object({
         page : Joi.number().integer().min(1).max(1000).default(1)
    });
    validateRequest(req, res, next, schema,1);
  }
function createReviewSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().min(2).required(),
        movieTitle: Joi.string().min(2).required(),
        rating: Joi.number().integer().min(1).max(5).required(),
        description: Joi.string().optional(),
        movieId: Joi.number().integer().min(1).required()
    });
    validateRequest(req, res, next, schema);
}
  

router.get('/' ,homepageSchema,ensureAuthenticated,movies.HomePage);
router.get('/movies/:id' , ensureAuthenticated,movies.movieDetails);
router.post('/movies/:id/reviews',createReviewSchema, ensureAuthenticated, movies.createReview);
router.post('/reviews/delete/:id', ensureAuthenticated, movies.deleteReview);


module.exports  = router