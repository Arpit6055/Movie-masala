const router = require('express').Router(),
Joi = require("joi"),
validateRequest = require('../config/validate-request'),
movies = require('../controllers/movies.controller'),
{ensureAuthenticated, forwardAuthenticated } = require("../config/auth");


function homepageSchema(req, res, next) {
    const schema = Joi.object({
         page : Joi.number().integer().min(1).max(1000).default(1),
         search : Joi.string().optional()
    });
    validateRequest(req, res, next, schema,1);
  }
function reviewCountSchema(req, res, next) {
    const schema = Joi.object({
         id:Joi.number().integer().min(1).required()
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
function updateReviewSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().min(2).required(),
        movieTitle: Joi.string().min(2).required(),
        rating: Joi.number().integer().min(1).max(5).required(),
        description: Joi.string().required(),
        movieId: Joi.number().integer().min(1).required()
    });
    validateRequest(req, res, next, schema);
}
  
//movies API
router.get('/' ,homepageSchema,ensureAuthenticated,movies.HomePage);
router.get('/:search/' ,homepageSchema,ensureAuthenticated,movies.HomePage);
router.get('/movies/:id' , ensureAuthenticated,movies.movieDetails);
router.post('/movies/:id/reviews',createReviewSchema, ensureAuthenticated, movies.createReview);

//rotten-potato-rating
router.get('/reviews/rating',reviewCountSchema, movies.countandtotalReview);

//review APIs
router.get('/reviews/:id', ensureAuthenticated, movies.showReview);
router.post('/reviews/delete/:id/', ensureAuthenticated, movies.deleteReview);
router.post('/reviews/update/:id/',updateReviewSchema, forwardAuthenticated, movies.updateReview);





module.exports  = router