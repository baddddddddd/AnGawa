import { APIConnector } from "./api_connector.js"
import { CookieManager } from "./cookies.js";

if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}

let selectedChoice = null;

let questionsView = document.querySelector(".questions-view");
let choicesView = document.querySelector(".choices-view");


choicesView.ondragover = (event) => {
    event.preventDefault(); 
};

choicesView.ondrop = (event) => {
    if (!selectedChoice || !selectedChoice.questionAssigned) {
        event.preventDefault();
        return;
    }

    selectedChoice.questionAssigned.resetAnswer();
    selectedChoice.questionAssigned = null;
    choicesView.appendChild(selectedChoice.container);
};

class Choice {
    static instances = []

    constructor(text) {
        Choice.instances.push(this)

        this.text = text;

        this.container = document.createElement("div");
        this.container.className = "choice";
        this.container.innerHTML = text;
        this.container.draggable = true;
        this.container.dataset.index = Choice.instances.length - 1;

        this.container.ondragstart = (event) => {
            selectedChoice = this;

            this.resetIndicators();
        };

        this.container.ondragend = (event) => {
            setTimeout(() => {
                selectedChoice = null;
            }, 0);
        };

        this.questionAssigned = null;

        this.container.onclick = () => {
            this.resetIndicators();

            if (this.questionAssigned) {
                this.questionAssigned.resetAnswer();
                this.questionAssigned = null;

                choicesView.appendChild(this.container);
            }

        };

        this.container.ondragover = (event) => {
            event.preventDefault();
        }
    }

    resetIndicators() {
        Question.instances.forEach((question) => {
            question.resetIndicator();
        });
    }
}

class Question {
    static instances = []

    constructor(text, answer) {
        Question.instances.push(this);

        this.text = text;
        this.answer = answer;

        this.container = document.createElement("div");
        this.container.className = "question";
        this.container.dataset.index = Question.instances.length - 1;


        this.answerBox = document.createElement("div");
        this.answerBox.className = "answer-box";
        this.answerBox.innerHTML = "spacerrrrrrrr";
        

        let questionSplit = this.text.split("__________");
        
        let leftSplit = document.createElement("span");
        leftSplit.innerHTML = `${Question.instances.length}. ${questionSplit[0]}`;

        let rightSplit = document.createElement("span");
        rightSplit.innerHTML = questionSplit[1];

        this.answerBox.ondragover = (event) => {
            event.preventDefault();
        };

        this.userAnswer = null;

        this.answerBox.ondrop = (event) => {
            this.userAnswer = selectedChoice;

            if (this.userAnswer.questionAssigned) {
                this.userAnswer.questionAssigned.resetAnswer();
            }

            this.answerBox.replaceWith(this.userAnswer.container);
            this.userAnswer.questionAssigned = this;

        };

        this.container.appendChild(leftSplit);
        this.container.appendChild(this.answerBox);
        this.container.appendChild(rightSplit);
    }

    resetAnswer() {
        this.userAnswer.container.replaceWith(this.answerBox);
        this.userAnswer = null;
    }

    checkAnswer() {
        if (!this.userAnswer || this.userAnswer.text != this.answer) {
            this.indicateWrong();
        } else {
            this.indicateCorrect();
        }
    }

    resetIndicator() {
        this.answerBox.classList.remove("wrong");
        this.answerBox.classList.remove("correct");

        if (this.userAnswer) {
            this.userAnswer.container.classList.remove("correct");
            this.userAnswer.container.classList.remove("wrong");
        }
    }

    indicateCorrect() {
        this.userAnswer.container.classList.add("correct");
    }

    indicateWrong() {
        if (this.userAnswer) {
            this.userAnswer.container.classList.add("wrong");
        } else {
            this.answerBox.classList.add("wrong");
        }
    }
}

async function initialize() {
    Choice.instances = [];
    Question.instances = [];
    questionsView.innerHTML = "";
    choicesView.innerHTML = "";
    
    let noteID = CookieManager.getCookie("noteID");
    let result = await APIConnector.generateMatchingType(noteID);

    let choices = result["choices"];


    choices.forEach((choice) => {
        let element = new Choice(choice);
        choicesView.appendChild(element.container);
    });

    let questions = result["questions"];

    questions.forEach((question) => {
        let element = new Question(question["item"], question["answer"]);

        questionsView.appendChild(element.container);
    });
}

document.querySelector(".back-btn").onclick = () => {
    document.location.href = "./editor.html";
};

document.querySelector("#regenerate-btn").onclick = () => {
    initialize().then();
};

document.querySelector("#check-btn").onclick = () => {
    Question.instances.forEach((question) => {
        question.checkAnswer();
    });
};

await initialize();
