<<<<<<< HEAD
//const body = document.querySelector("body"),
//      sidebar = body.querySelector(".sidebar")
//
//sidebar.addEventListener("mouseenter", () => {
//  sidebar.classList.remove("close");
//})
//
//
//sidebar.addEventListener("mouseleave", () => {
//  sidebar.classList.add("close");
//})
=======
const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar")

sidebar.addEventListener("mouseenter", () => {
  sidebar.classList.remove("close");
})


sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.add("close");
})
>>>>>>> 66a23d1f3c0b39ff88bb1ebe733e480791f6b228


const cards = document.querySelectorAll(".card")

cards.forEach(card => {
  card.addEventListener("dragstart", () => {
    setTimeout(() => card.classList.add("dragging"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});