$(document).ready(function () {
  $(".delete-review").submit(deleteReview)
  $("#review-form").submit(createReview);
})
function insertAfter(newElement, referenceElement) {
  referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}


function createReview(event) {
  event.preventDefault();

  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    data: $(this).serialize(),
  })
  .done(function (review) {
    $("[name='reviews-col']").prepend(
    `
    <div class="card pt-2 px-2 mb-4" id="review-${review._id}">
      <div class="card-body">
          <h4 class="card-title text-primary">
              <a href="/reviews/${review._id}" class="text-reset">${review.title}</a>
          </h4>
          <h5 class="card-subtitle text-primary mb-4 font-weight-bold">${review.rating} / 5</h5>
          <div class="card-text">
              <div style="max-height: 50vh; overflow-y: scroll">
                  <blockquote style="white-space: pre-line">${review.description}</blockquote>
              </div>
              <!-- Buttons -->
              <div class="d-flex flex-row-reverse mt-3">
                  <a href="/reviews/${review._id}" class="btn btn-link">View</a>
                  <button class="btn btn-link" type="button" data-toggle="modal" data-target="#delete-review-${review._id}">Delete</button>
              </div>
          </div>
      </div>
    </div>
    `)

    $("#delete-modals").prepend(
    `
    <div class="modal" id="delete-review-${review._id}">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-body p-5">
                  <div class="modal-title col-12 mb-5 text-center">
                      <span class="material-icons" style="font-size: 70px; color: rgb(45, 62, 79)">delete</span>
                      <div class="mt-4">
                          <h4 style="color: rgb(45, 62, 79)">You're about to delete this review</h4>
                      </div>
                  </div>
                  <form class="mb-2 delete-review" method="POST" action="/reviews/delete/${review._id}"><button type="submit" class="btn btn-danger btn-block btn-lg" data-dismiss="modal">Delete</button></form>
                  <button type="button" class="btn btn-block btn-secondary btn-lg" data-dismiss="modal">Cancel</button>
              </div>
          </div>
      </div>
    </div>
    `
    )

    $(`#delete-review-${review._id}`).find(".delete-review").click(deleteReview);
    $("input, textarea").not("[type=hidden]").not("[readonly]").val("")
    $("select").val(5);
    $(".modal").modal("hide");
  })
  .fail(function (error) {
      alert(error.responseJSON.error)
      console.error(error);
  })
}

function deleteReview(event) {
  event.preventDefault();
  console.log($(this).attr("action"));
  var reviewId = $(this).attr("action").match(/\/reviews\/(\w*)/)[1];
  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    complete: function(xhr, textStatus) {
      console.log("removed");
      window.location=window.location.origin;
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log(textStatus + ": " + jqXHR.status + " " + errorThrown);
    }
  })
}
