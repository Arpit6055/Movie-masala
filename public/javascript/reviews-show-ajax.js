$(document).ready(function () {
  $("#review-form").submit(editReview);
})

function editReview(event) {
  event.preventDefault();
  console.log($(this).serialize())

  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    data: $(this).serialize(),
  })
  .done(function (review) {
    console.log(review);
    test = review;
    $("#review-title-info").text(review.title);
    $("#review-rating-info").text(review.rating);
    $("#review-description-info").text(review.description);
    $("#review-title").val(review.title);
    $("#review-rating").val(review.rating);
    $("#review-description").text(review.description);
    $(".modal").modal("hide");
    window.location.reload()
  })
  .fail(function (error) {
      alert('There was a problem saving your edits. Please try again.')
      console.error(error);
  })
}


