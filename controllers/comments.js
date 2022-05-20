// comments.js

const Comment = require('../models/comment');

module.exports = (app) => {

	// CREATE
    app.post('/reviews/:reviewId/comments', (req, res) => {
        console.log(req.body);
        Comment.create(req.body)
        .then(comment => {
            res.status(200).send(comment);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err)
        })
    });

    // DELETE
    app.delete('/reviews/:reviewId/comments/:id', function (req, res) {
        Comment.findByIdAndRemove(req.params.id)
        .then(comment => {
            console.log("Deleted comment");
            res.status(200).send(comment);
        })
        .catch(err => {
            console.log(err.message);
            res.status(400).send(err);
        })
    })

}

