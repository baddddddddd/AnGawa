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
    constructor(noteID, noteTitle, noteModified) {
        this.noteID = noteID;

        this.container = document.createElement("div");
        this.container.className = "note-card";

        this.titleElement = document.createElement("span");
        this.titleElement.className = "note-title";
        this.titleElement.innerHTML = `<span>${noteTitle}</span>`;

        let dragIcon = document.createElement("i");
        dragIcon.className = "bx";

        let options = document.createElement("div");
        options.className = "options";
        let optionsIcon = document.createElement("i");
        optionsIcon.className = "bx bx-dots-vertical-rounded";

        let optionsMenu = document.createElement("ul");
        optionsMenu.className = "options-menu";

        let masked = false;

        let editButton = document.createElement("li");
        editButton.innerHTML = '<i class="bx bx-edit"></i>Edit';
        editButton.className = "option-btn";
        editButton.onclick = () => {
            masked = true;
            optionsMenu.classList.remove("show");
            this.editNote();

            setTimeout(() => {
                masked = false;
            }, 0);
        };

        let renameButton = document.createElement("li");
        renameButton.innerHTML = "<i class='bx bxs-rename' ></i>Rename";
        renameButton.className = "option-btn";
        renameButton.onclick = () => {
            masked = true;

            optionsMenu.classList.remove("show");
            this.renameTitle();

            setTimeout(() => {
                masked = false;
            }, 0);
        };

        let deleteButton = document.createElement("li");
        deleteButton.innerHTML = '<i class="bx bx-trash"></i>Delete';
        deleteButton.className = "option-btn";
        deleteButton.onclick = () => {
            masked = true;
            optionsMenu.classList.remove("show");
            this.deleteNote();

            setTimeout(() => {
                masked = false;
            }, 0);
        };

        let modifiedInfo = document.createElement("div");
        modifiedInfo.innerHTML = noteModified;
        
        let leftPortion = document.createElement("div");
        let rightPortion = document.createElement("div");
        rightPortion.className = "right-portion";

        this.titleElement.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                event.preventDefault();

                this.confirmTitle();
            }
        });

        optionsIcon.addEventListener("click", (event) => {
            masked = true;
            
            document.querySelectorAll(".show").forEach((element) => {
                if (element == optionsMenu) {
                    return;
                }

                element.classList.remove("show");
            });

            if (optionsMenu.classList.contains("show")) {
                optionsMenu.classList.remove("show");
            } else {
                optionsMenu.classList.add("show");
            }

            setTimeout(() => {
                masked = false;
            }, 0);
        });

        leftPortion.appendChild(dragIcon);
        leftPortion.appendChild(this.titleElement);

        optionsMenu.appendChild(editButton);
        optionsMenu.appendChild(renameButton);
        optionsMenu.appendChild(deleteButton);

        options.appendChild(optionsIcon);
        options.appendChild(optionsMenu);
        rightPortion.appendChild(modifiedInfo);
        rightPortion.appendChild(options);

        this.container.appendChild(leftPortion);
        this.container.appendChild(rightPortion);

        this.container.addEventListener("click", () => {
            if (masked) {
                return;
            }
            
            this.editNote();
        });
    }

    editNote() {
        CookieManager.setCookie("noteID", this.noteID);
        document.location.href = "editor.html";
    }

    renameTitle() {
        this.titleElement.contentEditable = true;

        var range = document.createRange();

        range.selectNodeContents(this.titleElement);

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    confirmTitle() {
        APIConnector.renameNote(this.noteID, this.titleElement.textContent)
            .then((result) => {
                this.titleElement.contentEditable = false;

                let selection = window.getSelection();
                selection.removeAllRanges();
            });
    }

    deleteNote() {
        APIConnector.deleteNote(this.noteID)
            .then((result) => {
                this.container.remove();
            });
    }
}

async function initialize() {
    let noteView = document.querySelector(".note-view");

    let notes = await APIConnector.getNotes();

    if (notes.length == 0) {
        return;
    }

    noteView.innerHTML = "";
    notes.forEach((note) => {
        let dateObject = new Date(note["last_modified"]);

        let formattedDate = dateObject.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });

        let noteCard = new NoteCard(note["note_id"], note["note_title"], formattedDate);
        
        noteView.appendChild(noteCard.container);
    });
}

await initialize();
