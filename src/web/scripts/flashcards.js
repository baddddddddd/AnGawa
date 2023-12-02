import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}


class Card {
    static instances = []

    constructor(frontText, backText) {
        this.frontText = frontText;
        this.backText = backText;

        this.container = document.createElement("div");
        this.container.className = "card-container";

        this.card = document.createElement("div");
        this.card.className = "card";

        this.cardFront = document.createElement("div");
        this.cardFront.className = "card-front";

        this.cardBack = document.createElement("div");
        this.cardBack.className = "card-back";

        this.container.appendChild(this.card);
        this.card.appendChild(this.cardFront);
        this.card.appendChild(this.cardBack);

        this.cardFront.innerHTML = this.frontText;
        this.cardBack.innerHTML = this.backText;

        this.container.addEventListener("click", (event) => {
            this.flip()
        });

        document.addEventListener("keydown", (event) => {
            if (event.key == " ") {
                if (this.container.dataset.index == active_index) {
                    this.flip();
                }
            }
        });

        this.container.dataset.index = Card.instances.length;
        this.container.dataset.status = Card.instances.length == 0 ? "active" : "inactive";
        Card.instances.push(this);
    }

    flip() {
        if (this.card.classList.contains("flipped")) {
            this.card.classList.remove("flipped");
        } else {
            this.card.classList.add("flipped");
        }
    }
}


async function initialize() {
    let noteID = CookieManager.getCookie("noteID");

    let result = await APIConnector.generateFlashcards(noteID);
    let items = result["items"];
    
    let cardView = document.querySelector(".card-view");

    items.forEach((item) => {
        let front = item["item"];
        let back  = item["answer"];

        let card = new Card(front, back);
        cardView.appendChild(card.container);
    });
}

await initialize();


let active_index = 0;

let groups = document.getElementsByClassName("card-container");

let cardIndex = document.querySelector("#card-index");
cardIndex.innerHTML = `<span>${active_index + 1} / ${groups.length}</span>`;

const handleSwipeLeft = () => {
    const next_index = (active_index - 1) >= 0 ? (active_index - 1) : groups.length - 1;

    const current_group = document.querySelector(`[data-index="${active_index}"]`);
    const next_group = document.querySelector(`[data-index="${next_index}"]`);
    next_group.querySelector(".card").classList.remove("flipped");

    current_group.dataset.status = "to-right";
    next_group.dataset.status = "from-left";
    
    active_index = next_index;
    cardIndex.innerHTML = `<span>${active_index + 1} / ${groups.length}</span>`;

    setTimeout(() => {
        next_group.dataset.status = "active";
        active_index = next_index;
    }, 50);
}

const handleSwipeRight = () => {
    const next_index = (active_index + 1) < groups.length ? (active_index + 1) : 0;

    const current_group = document.querySelector(`[data-index="${active_index}"]`);
    const next_group = document.querySelector(`[data-index="${next_index}"]`);
    next_group.querySelector(".card").classList.remove("flipped");

    current_group.dataset.status = "to-left";
    next_group.dataset.status = "from-right";

    active_index = next_index;
    cardIndex.innerHTML = `<span>${active_index + 1} / ${groups.length}</span>`;
    
    setTimeout(() => {
        next_group.dataset.status = "active";
    }, 50);
    
}

document.querySelector(".prev-btn").addEventListener("click", (event) => {
    handleSwipeLeft();
});

document.querySelector(".next-btn").addEventListener("click", (event) => {
    handleSwipeRight();
});

document.querySelector(".back-btn").addEventListener("click", (event) => {
    document.location.href = "./editor.html";
});

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft") {
        handleSwipeLeft();
    } else if (event.key == "ArrowRight") {
        handleSwipeRight();
    }
});