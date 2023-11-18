class BulletContainer {
    static editorView = document.getElementsByClassName("editor-view")[0];

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "bullet-container";

        this.bulletIcon = document.createElement("div");
        this.bulletIcon.className = "bullet-icon";
        this.bulletIcon.innerHTML = "<i class='bx bxs-circle'></i>";

        this.textContainer = document.createElement("div");
        this.textContainer.className = "bullet-text";
        this.textContainer.setAttribute("contenteditable", "true");

        this.container.append(this.bulletIcon);
        this.container.append(this.textContainer);

        this.textContainer.addEventListener("keydown", (event) => {
            if (document.activeElement != this.textContainer) {
                return;
            }

            if (event.key == "Enter") {
                event.preventDefault();

                let newBullet = new BulletContainer();
                newBullet.container.style.marginLeft = this.container.style.marginLeft;
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

                let currentIndentation = parseInt(window.getComputedStyle(this.container).marginLeft, 10);
                let indentChange = 28 * ((event.shiftKey) ? -1 : 1);
                let newIndentation = currentIndentation + indentChange;

                if (newIndentation < 0) {
                    return;
                }

                this.container.style.marginLeft = `${newIndentation}px`;
            }
        });
    }
}


let editorView = document.getElementsByClassName("editor-view")[0];

let test = new BulletContainer();
editorView.appendChild(test.container);
