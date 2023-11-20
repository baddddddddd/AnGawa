import { APIConnector } from "./api_connector.js";
import { CookieManager } from "./cookies.js";


let createButton = document.getElementById("create-note-btn");
createButton.addEventListener("click", createNote);


async function createNote() {
    let result = await APIConnector.createNote();
    let noteID = result["note_id"];

    CookieManager.setCookie("noteID", noteID);
    window.location.href = "./editor.html";
}


class NoteCard {
    constructor(noteID, noteTitle) {
        this.container = document.createElement("div");
        this.container.className = "note-card";

        this.titleElement = document.createElement("span");
        this.titleElement.className = "note-title";
        this.titleElement.innerHTML = `<span>${noteTitle}</span>`;

        let dragIcon = document.createElement("i");
        dragIcon.className = "bx";

        let optionsIcon = document.createElement("i");
        optionsIcon.className = "bx";

        let leftPortion = document.createElement("div");
        let rightPortion = document.createElement("div");

        leftPortion.appendChild(dragIcon);
        leftPortion.appendChild(this.titleElement);

        rightPortion.appendChild(optionsIcon);

        this.container.appendChild(leftPortion);
        this.container.appendChild(rightPortion);

        this.container.addEventListener("click", () => {
            CookieManager.setCookie("noteID", noteID);
            document.location.href = "editor.html";
        });
    }
}

async function initialize() {
    let noteView = document.getElementsByClassName("note-view")[0];

    let notes = await APIConnector.getNotes();

    if (notes.length == 0) {
        return;
    }

    noteView.innerHTML = "";
    notes.forEach((note) => {
        let noteCard = new NoteCard(note["note_id"], note["note_title"]);

        noteView.appendChild(noteCard.container);
    });
}

await initialize();
