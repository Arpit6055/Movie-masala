var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
  }
  ready(() => { 
		document.querySelector('[data-toggle="tooltip"]').tooltip();
		let confirmDelete = document.querySelector("#confirm-delete")
		confirmDelete.addEventListener("click", ()=>{
			document.querySelector(".select-review:checked").closest("tr").each(function(){
				const reviewId = this["id"];
				fetch(`/reviews/delete/${reviewId}`,{
					method: 'POST'
				}).then(data => {
					document.querySelector(`#${reviewId}`).remove();
				  })
				  .catch((error) => {
					console.error('Error:', error);
				  });
			})
		})
  });