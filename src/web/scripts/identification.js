import { APIConnector } from "./api_connector.js"
import { CookieManager } from "./cookies.js";

if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}

let answerBox = document.querySelector(".answer-box");
let questionCard = document.querySelector(".question-card");
let cardIndex = document.querySelector("#card-index");

let activeIndex;
let items;

async function initialize() {
    let noteID = CookieManager.getCookie("noteID");

    let result = await APIConnector.generateFlashcards(noteID);
    items = result["items"];
    
    items.forEach((item) => {
        item["correct"] = false;
    });
    
    activeIndex = 0;
    showQuestion(0);
}

function showQuestion(index) {
    questionCard.innerHTML = items[index]["item"];


    let isAnsweredCorrectly = items[index]["correct"];
    if (isAnsweredCorrectly) {
        answerBox.contentEditable = false;
        answerBox.innerHTML = items[index]["answer"];
        answerBox.classList.add("right-answer-indicator");
    } else {
        answerBox.contentEditable = true;
        answerBox.innerHTML = "";
        answerBox.classList.remove("right-answer-indicator");
        answerBox.focus();
    }
    
    cardIndex.innerHTML = `<span>${activeIndex + 1} / ${items.length}</span>`;
}

function nextQuestion() {
    activeIndex = (activeIndex < items.length - 1) ? (activeIndex + 1) : 0;
    showQuestion(activeIndex);
}

function prevQuestion() {
    activeIndex = (activeIndex > 0) ? (activeIndex - 1) : items.length - 1;
    showQuestion(activeIndex);
}

function checkAnswer() {
    let givenAnswer = answerBox.textContent.trim();
    let correctAnswer = items[activeIndex]["answer"];

    if (givenAnswer == correctAnswer) {
        feedbackCorrect();
    } else {
        feedbackWrong();
    }
}

function feedbackCorrect() {
    items[activeIndex]["correct"] = true;
    answerBox.contentEditable = false;

    answerBox.classList.add("right-answer-indicator");
}

function feedbackWrong() {
    answerBox.classList.add("wrong-answer-animation");

    setTimeout(() => {
        answerBox.classList.remove("wrong-answer-animation");
    }, 500);
}

answerBox.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        checkAnswer();
    }
});

document.querySelector(".back-btn").onclick = () => {
    document.location.href = "./editor.html";
};

document.querySelector("#regenerate-btn").onclick = () => {
    initialize().then();
};

document.querySelector(".next-btn").onclick = () => {
    nextQuestion();
};

document.querySelector(".prev-btn").onclick = () => {
    prevQuestion();
};

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
        event.preventDefault();

        if (event.key == "ArrowLeft") {
            prevQuestion();
        } else {
            nextQuestion();
        }
    }
});

await initialize();
