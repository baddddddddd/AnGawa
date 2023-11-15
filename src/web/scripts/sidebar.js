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


const cards = document.querySelectorAll(".card")

cards.forEach(card => {
  card.addEventListener("dragstart", () => {
    setTimeout(() => card.classList.add("dragging"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});