const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 400;
const btn = document.querySelector(".lol");
window.closeall = false;

let moveInterval = null;
let spawnInterval = null;

function getScreenBounds(){
    return {
        left: window.screen.availLeft || 0,
        top: window.screen.availTop || 0,
        width: window.screen.availWidth,
        height: window.screen.availHeight
    };
}

function randomPosition(winWidth, winHeight){
    const { left, top, width, height } = getScreenBounds();
    const x = left + Math.random() * Math.max(0, width - winWidth);
    const y = top + Math.random() * Math.max(0, height - winHeight);
    return { x, y };
}

function shouldStop() {
    return window.closeall || window.opener?.closeall || localStorage.getItem("virus_kill");
}

function cleanup(){
    if (moveInterval) clearInterval(moveInterval);
    if (spawnInterval) clearInterval(spawnInterval);
    moveInterval = null;
    spawnInterval = null;
    if (window.opener) window.close();
}

function kill(){
    window.closeall = true;
    localStorage.setItem("virus_kill", "1");
    window.location.reload();
}

function openwindow(){
    if (shouldStop()) return;
    const { x, y } = randomPosition(POPUP_WIDTH, POPUP_HEIGHT);
    window.open("./popup.html", "_blank", "width="+POPUP_WIDTH+",height="+POPUP_HEIGHT+",left="+x+",top="+y);
}

function move(){
    if (shouldStop()) {
        cleanup();
        return;
    }
    window.moveBy((Math.random()-0.5)*50,(Math.random()-0.5)*50);
}

window.addEventListener("storage", (e) => {
    if (e.key === "virus_kill" && e.newValue) cleanup();
});

if (!window.opener){
    localStorage.removeItem("virus_kill");
}

if(window.opener){
    move();
    moveInterval = setInterval(move, 50);
    spawnInterval = setInterval(openwindow, 3000);

    document.addEventListener("mousemove", () => {
        if (shouldStop()) {
            cleanup();
            return;
        }
        const { x, y } = randomPosition(window.outerWidth, window.outerHeight);
        window.moveTo(x, y);
        openwindow();
    });
}