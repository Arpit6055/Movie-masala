//reviews.js

const Review = require('../models/review');
const Comment = require('../models/comment');

module.exports = function(app) {

	// SHOW
	app.get('/reviews/:id', (req, res) => {
		Promise.all([
			Review.findById(req.params.id).lean(),
			Comment.find({ reviewId: req.params.id }).sort('-date').lean()
		])
		.then(entries => {
			[review, comments] = entries;
			console.log(review);
			res.render('reviews-show', {
	  			review: review, comments: comments
	  		})
	  	})
	    .catch(console.error)
	});

	// CREATE
    app.post('/movies/:id/reviews', (req, res) => {
        Review.create(req.body)
        .then(review => {
            console.log(review);
            res.status(200).send(review)
        })
        .catch(err => {
        	console.error(err);
        	res.status(400).send(err);
        })
    });

	// UPDATE
	app.put('/reviews/:id', (req, res) => {
	  Review.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
	    .then(review => {
	    	console.log(review);
	    	res.status(200).send(review)
	    })
	    .catch(err => {
	    	console.error(err);
	    	res.status(400).send(err);
	    })
	})

	// DELETE
	app.delete('/reviews/:id', function (req, res) {
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
	})
}
