import { APIConnector } from "./api_connector.js";
import { CookieManager } from "./cookies.js";


var hasUnsavedChanges = false;

class BulletContainer {
    static instances = [];
    static INDENT_SIZE = 28;

    constructor(text, indentation) {
        BulletContainer.instances.push(this);

        this.container = document.createElement("div");
        this.container.className = "bullet-container";

        this.bulletIcon = document.createElement("div");
        this.bulletIcon.className = "bullet-icon";
        this.bulletIcon.innerHTML = "<i class='bx bxs-circle'></i>";

        this.textContainer = document.createElement("div");
        this.textContainer.className = "bullet-text";
        this.textContainer.setAttribute("contenteditable", "true");
        this.textContainer.innerHTML = text;

        this.indentation = indentation;
        this.container.style.marginLeft = `${this.indentation * BulletContainer.INDENT_SIZE}px`;

        this.container.append(this.bulletIcon);
        this.container.append(this.textContainer);

        this.textContainer.addEventListener("keydown", (event) => {
            hasUnsavedChanges = true;

            if (document.activeElement != this.textContainer) {
                return;
            }

            if (event.key == "Enter") {
                event.preventDefault();

                let newBullet = new BulletContainer("", this.indentation);
                this.container.insertAdjacentElement("afterend", newBullet.container);
                newBullet.textContainer.focus();
            } 

            else if (event.key === "Backspace" || event.code === "Backspace") {
                if (this.textContainer.textContent === "") {
                    event.preventDefault();

                    let nextBullet = this.container.previousElementSibling;

                    if (nextBullet) {
                        let nextTextContainer = nextBullet.querySelector(".bullet-text")
                        nextTextContainer.focus();

                        var range = document.createRange();
                        var selection = window.getSelection();
                        
                        range.selectNodeContents(nextTextContainer);
                        range.collapse(false);
                        
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        this.container.remove();

                        BulletContainer.instances = BulletContainer.instances.filter(element => element !== this);
                    }
                }
            }

            else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                if (document.activeElement === this.textContainer) {
                    event.preventDefault();

                    let nextBullet = (event.key === "ArrowUp")
                        ? this.container.previousElementSibling
                        : this.container.nextElementSibling;

                    if (nextBullet) {
                        let nextTextContainer = nextBullet.querySelector(".bullet-text")
                        nextTextContainer.focus();

                        var range = document.createRange();
                        var selection = window.getSelection();
                        
                        range.selectNodeContents(nextTextContainer);
                        range.collapse(false);
                        
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }

            else if (event.key == "Tab") {
                event.preventDefault();

                this.indentation += ((event.shiftKey) ? -1 : 1);
                
                if (this.indentation < 0) {
                    this.indentation = 0;
                    return;
                }

                this.container.style.marginLeft = `${this.indentation * BulletContainer.INDENT_SIZE}px`;
            }
        });
    }

    getText() {
        return this.textContainer.textContent;
    }
}

async function saveNote() {
    if (!hasUnsavedChanges) {
        return;
    }

    let bullet_dict = [];

    BulletContainer.instances.forEach((bullet) => {
        bullet_dict.push({
            "text": bullet.textContainer.innerHTML,
            "indentation": bullet.indentation,
        });
    });

    let noteID = CookieManager.getCookie("noteID");
    let noteTitle = document.querySelector(".title-text").textContent;
    let noteContent = bullet_dict;

    await APIConnector.saveNote(noteID, noteTitle, noteContent);

    hasUnsavedChanges = false;
}


async function initialize() {
    setInterval(saveNote, 60 * 1000);

    let noteID = CookieManager.getCookie("noteID");

    let result = await APIConnector.getNote(noteID);

    let noteContent = result["note_content"];

    let editorView = document.getElementsByClassName("editor-view")[0];

    let titleText = document.querySelector(".title-text");
    titleText.innerHTML = result["note_title"];

    noteContent.forEach((bullet) => {
        let text = bullet["text"];
        let indentation = bullet["indentation"];

        let element = new BulletContainer(text, indentation).container;
        editorView.appendChild(element);
    });

    titleText.addEventListener("keydown", (event) => {
        hasUnsavedChanges = true;

        if (event.key == "Enter") {
            event.preventDefault();

            let firstBullet = titleText.nextElementSibling.querySelector(".bullet-text");
            firstBullet.focus();

            var range = document.createRange();
            var selection = window.getSelection();
            
            range.selectNodeContents(firstBullet);
            range.collapse(false);
            
            selection.removeAllRanges();
            selection.addRange(range);
        }

        else if (event.ctrlKey) {
            if (event.key == "b" || event.key == "B" || event.key == "i" || event.key == "I") {
                event.preventDefault();
            }
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        if (event.key == "s" || event.key == "S") {
            event.preventDefault();
            saveNote();
            console.log("save");
        }
    }
});

document.querySelector(".back-btn").addEventListener("click", (event) => {
    saveNote().then(() => document.location.href = "./notes.html");
});

window.addEventListener("beforeunload", (event) => {
    if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
    }
    
});

await initialize();

