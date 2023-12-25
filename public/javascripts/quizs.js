
// update product
let name = document.getElementById("title");
let duration = document.getElementById("duration");
let questions = document.getElementById("questions");
let description = document.getElementById("description");
let editIcon = document.getElementsByClassName("update");
let quizid = "";
const closeIcon = document.getElementsByClassName("fa-window-close")[0];
closeIcon.addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
});

for (let i = 0; i < editIcon.length; i++) {
  console.log(editIcon[i].dataset);
  editIcon[i].addEventListener("click", (e) => {
    document.getElementById("overlay").style.display = "block";
    quizid = editIcon[i].dataset.doc;
    fetch(`/quizes/${quizid}`).then((res) => {
      res.json().then((productData) => {
        Title.value = productData[0].Title;
        duration.value = productData[0].duration;
        questions.value = productData[0].questions;
        description.value = productData[0].description;
      });
    });
  });
}
// update btn
let updateBtn = document.getElementById("btn");
updateBtn.addEventListener("click", editProduct);
function editProduct() {
  document.getElementById("overlay").style.display = "none";
  fetch(`/quizes/${quizid}`, {
    method: "PUT",
    body: JSON.stringify({
      Title: Title.value,
      questions: questions.value,
      duration: duration.value,
      description: description.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then(() => (window.location.href = "/quizes"));
}
// delete product
let trashcan = document.getElementsByClassName("delete");
console.log(trashcan.length)
for (let i = 0; i < trashcan.length; i++) {
  console.log(trashcan[i].dataset)
  trashcan[i].addEventListener("click", (e) => {
    const endpoint = `/quizes/${trashcan[i].dataset.doc}`;
    fetch(endpoint, {
      method: "DELETE",
    }).then(() => (window.location.href = "/quizes"));
  });
}
// function deletedata(quizId){
//   console.log(quizId);
//   const endpoint = `/quizes/${quizId}`;
//   fetch(endpoint, {
//     method: "DELETE",
//   }).then(() => (window.location.href = "/quizes"));

// }