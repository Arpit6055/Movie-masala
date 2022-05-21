$(document).ready(function () {
  $("#comment-form").submit(createComment);
  $(".delete-comment").click(deleteComment);
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
  })
  .fail(function (error) {
      alert('There was a problem saving your edits. Please try again.')
      console.error(error);
  })
}

function createComment(event) {
  event.preventDefault();

  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    data: $(this).serialize(),
  })
  .done(function (comment) {
    $("[name='comments']").prepend(
    `
    <div class="card border-bottom" style="border: none" comment-id="${comment._id}">  
      <div class="card-body">
        <h5 class="card-title">${comment["title"]}</h5>
        <p class="card-text">${comment.content}</p>
        <!-- Delete link -->
        <button class="btn btn-link float-right delete-comment">Delete</button>
      </div>
    </div>
    `
    )
    $(`[comment-id=${comment._id}]`).find(".delete-comment").click(deleteComment);
    $("input, textarea").not("[type=hidden]").val("")
  })
  .fail(function (error) {
      alert('There was a problem saving your comment. Please try again.')
      console.error(error);
  })
}

function deleteComment () {
  const comment = $(this).closest("[comment-id]");
  const commentId = comment.attr("comment-id");
  $.ajax({
    type: "POST",
    url: `${window.location.pathname}/comments/${commentId}/?_method=DELETE`
  })
  .done(() => { 
    comment.remove();
   })
  .fail(console.error)
}
