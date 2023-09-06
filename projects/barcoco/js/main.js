// general canvas and update info
var canvas = null;
var ctx = null;
var framerate = 1000 / 30;
// image elements
var barExteriorImg1;
var barExteriorImg2;
var barExteriorImg3;
var barInteriorImg1;
var barInteriorImg2;
var karaokeSongSelectImg;
var currentKaraokeSongImgs;
var karaokeSongYakuzaImgs;
var karaokeSongEyepatchImgs;
var karaokeSongEyepatchImg1;
var karaokeSongEyepatchImg2;
// audio elements
var shopBellAudio;
var barCocoAudio;
var songsToElement;
var machineGunKissAudio;
var judgementAudio;
var hourCinderellaAudio;
var bakaMitaiAudio;
// other variables for tracking
var state;
var frameCount;
var currentImage;
var currentSong;
var currentLyric;
var lyricCounter;
var cocoDialogueIndex;
var language;
var canvas_horizontal_center;
var canvas_vertical_center;
var song_list_index = 1;

function loadCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    canvas_horizontal_center = canvas.width / 2;
    canvas_vertical_center = canvas.height / 2;
    barExteriorImg1 = document.getElementById("BarExteriorImg1");
    barExteriorImg2 = document.getElementById("BarExteriorImg2");
    barExteriorImg3 = document.getElementById("BarExteriorImg3");
    barInteriorImg1 = document.getElementById("BarInteriorImg1");
    barInteriorImg2 = document.getElementById("BarInteriorImg2");
    karaokeSongSelectImg = document.getElementById("KaraokeSongSelectImg");
    karaokeSongYakuzaImgs = [];
    karaokeSongYakuzaImgs.push(document.getElementById("KaraokeSongYakuzaImg1"));
    karaokeSongYakuzaImgs.push(document.getElementById("KaraokeSongYakuzaImg2"));
    karaokeSongEyepatchImgs = [];
    karaokeSongEyepatchImgs.push(document.getElementById("KaraokeSongEyepatchImg1"));
    karaokeSongEyepatchImgs.push(document.getElementById("KaraokeSongEyepatchImg2"));
    shopBellAudio = document.getElementById("ShopBell");
    barCocoAudio = document.getElementById("BarCocoAudio");
    barCocoAudio.loop = true;
    songsToElement = {};
    machineGunKissAudio = document.getElementById("MachineGunKiss");
    songsToElement[songList[1][0]] = {"audio": machineGunKissAudio, "lyrics": machineGunKiss};
    judgementAudio = document.getElementById("Judgement");
    songsToElement[songList[2][0]] = {"audio": judgementAudio, "lyrics": judgement};
    hourCinderellaAudio = document.getElementById("24HourCinderella");
    songsToElement[songList[3][0]] = {"audio": hourCinderellaAudio, "lyrics": hourCinderella};
    bakaMitaiAudio = document.getElementById("BakaMitai");
    songsToElement[songList[4][0]] = {"audio": bakaMitaiAudio, "lyrics": bakaMitai};
    state = states.OUTSIDE;
    language = "en";
    update();
}

function update() {
    if (state == states.OUTSIDE) {
        if (currentImage == null) {
            currentImage = barExteriorImg1;
            frameCount = 0;
            draw();
            writeText(text["enter"][language], canvas_horizontal_center, 480, "#FFFFFF", "bold 24px sans-serif");
        }
        if (frameCount == 20) {
            if (currentImage == barExteriorImg1) {
                currentImage = barExteriorImg2;
            }
            else if (currentImage == barExteriorImg2) {
                currentImage = barExteriorImg3;
            } else {
                currentImage = barExteriorImg1;
            }
            frameCount = 0;
            draw();
            writeText(text["enter"][language], canvas_horizontal_center, 480, "#FFFFFF", "bold 24px sans-serif");
        }
        else {
            frameCount++;
        }
    }
    else if (state == states.BAR) {
        if (currentImage == null) {
            currentImage = barInteriorImg1;
            draw();
            if (cocoDialogueIndex != -1) {
                drawCocoDialogueBubble();
                writeText(text["coco"][cocoDialogueIndex][language], canvas_horizontal_center, canvas_vertical_center + 75, "#000000", "bold 24px sans-serif");
            }
        }
        if (frameCount == 25) {
            if (currentImage == barInteriorImg1) {
                currentImage = barInteriorImg2;
            }
            else {
                currentImage = barInteriorImg1;
            }
            frameCount = 0;
            draw();
            if (cocoDialogueIndex != -1) {
                drawCocoDialogueBubble();
                writeText(text["coco"][cocoDialogueIndex][language], canvas_horizontal_center, canvas_vertical_center + 75, "#000000", "bold 24px sans-serif");
            }
        }
        else {
            frameCount++;
        }
    }
    else if (state == states.KARAOKE_MENU) {
        if (currentImage == null) {
            currentImage = karaokeSongSelectImg;
            draw();
            writeSongList();
        }
    }
    else if (state == states.KARAOKE_SONG) {
        if (currentImage == null) {
            currentImage = currentKaraokeSongImgs[0];
            currentLyric = 0;
            lyricCounter = songsToElement[currentSong]["lyrics"][currentLyric]["time"];
            draw();
            songsToElement[currentSong]["audio"].play();
        }
        if (frameCount == 45) {
            if (currentImage == currentKaraokeSongImgs[0]) {
                currentImage = currentKaraokeSongImgs[1];
            }
            else {
                currentImage = currentKaraokeSongImgs[0];
            }
            frameCount = 0;
            draw();
            writeText(songsToElement[currentSong]["lyrics"][currentLyric][language], canvas_horizontal_center, canvas_vertical_center - 100, "#000000", "bold 28px sans-serif");
        }
        else {
            frameCount++;
        }
        if (lyricCounter == 0) {
            if (currentLyric + 1 != songsToElement[currentSong]["lyrics"]["lineCount"]) {
                currentLyric++;
                lyricCounter = songsToElement[currentSong]["lyrics"][currentLyric]["time"];
                draw();
                writeText(songsToElement[currentSong]["lyrics"][currentLyric][language], canvas_horizontal_center, canvas_vertical_center - 100, "#000000", "bold 28px sans-serif");
            } 
            else {
                songsToElement[currentSong]["audio"].pause();
                songsToElement[currentSong]["audio"].currentTime = 0;
                currentSong = null;
                currentImage = null;
                frameCount = 0;
                cocoDialogueIndex = 3;
                currentKaraokeSongImgs = null;
                state = states.FADE_TO_BAR;
            }
        }
        else {
            lyricCounter--;
        }
    }
    else if (state == states.FADE_TO_BAR) {
        if (frameCount % 30 == 0) {
            ctx.fillStyle = "#000000C0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            frameCount++;
        }
        else if (frameCount == 89) {
            state = states.BAR;
            currentImage = null;
            frameCount = 0;
            shopBellAudio.pause();
            shopBellAudio.currentTime = 0;
            barCocoAudio.play();
        }
        else {
            frameCount++;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0);
}

function drawCocoDialogueBubble() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(canvas_horizontal_center - 275, canvas_vertical_center + 50, 550, 50);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(canvas_horizontal_center - 272, canvas_vertical_center + 53, 544, 44);
}

function writeText(text, x, y, fillStyle, font) {
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function writeSongList() {
    if (language == "jp") {
        writeText("< " + songList[song_list_index][1] + " >", canvas_horizontal_center, canvas_vertical_center, "#000000", "bold 36px sans-serif");
        writeText(text["select_song"][language], canvas_horizontal_center, canvas_vertical_center - 180, "#000000", "bold 36px sans-serif");
        writeText(songList[song_list_index - 1][1], canvas_horizontal_center, canvas_vertical_center - 54, "#000000", "bold 18px sans-serif");
        writeText(songList[song_list_index + 1][1], canvas_horizontal_center, canvas_vertical_center + 54, "#000000", "bold 18px sans-serif");
    }
    else {
        writeText("< " + songList[song_list_index][0] + " >", canvas_horizontal_center, canvas_vertical_center, "#000000", "bold 36px sans-serif");
        writeText(text["select_song"][language], canvas_horizontal_center, canvas_vertical_center - 180, "#000000", "bold 36px sans-serif");
        writeText(songList[song_list_index - 1][0], canvas_horizontal_center, canvas_vertical_center - 54, "#000000", "bold 18px sans-serif");
        writeText(songList[song_list_index + 1][0], canvas_horizontal_center, canvas_vertical_center + 54, "#000000", "bold 18px sans-serif");
    }
}

document.onkeydown = function(key) {
    if (key.key == "ArrowUp" || key.key == "ArrowDown" || key.key == " ") {
        key.preventDefault();
    }
    if (state == states.OUTSIDE) {
        if (key.key == "Enter") {
            shopBellAudio.play();
            state = states.FADE_TO_BAR;
            cocoDialogueIndex = 0;
        }
        else if (key.key.toLowerCase() == "e") {
            language = "en";
            draw();
            writeText(text["enter"][language], 480, 480, "#FFFFFF", "bold 24px sans-serif");
        }
        else if (key.key.toLowerCase() == "j") {
            language = "jp";
            draw();
            writeText(text["enter"][language], 480, 480, "#FFFFFF", "bold 24px sans-serif");
        }
    }
    else if (state == states.BAR) {
        if (key.key == "Enter") {
            if (cocoDialogueIndex == 1) {
                state = states.KARAOKE_MENU;
                currentImage = null;
                barCocoAudio.pause();
                barCocoAudio.currentTime = 0;
            } 
            else if (cocoDialogueIndex == 2){
                state = states.OUTSIDE;
                currentImage = null; 
                barCocoAudio.pause();
                barCocoAudio.currentTime = 0;
            }
            else if (cocoDialogueIndex == 3){
                cocoDialogueIndex = -1;
                draw();
            }
            else if (cocoDialogueIndex == -1){
                cocoDialogueIndex = 1;
                draw();
                drawCocoDialogueBubble();
                writeText(text["coco"][cocoDialogueIndex][language], canvas_horizontal_center, canvas_vertical_center + 75, "#000000", "bold 24px sans-serif");
            }
            else if (cocoDialogueIndex == 0) {
                cocoDialogueIndex = 1;
                draw();
                drawCocoDialogueBubble();
                writeText(text["coco"][cocoDialogueIndex][language], canvas_horizontal_center, canvas_vertical_center + 75, "#000000", "bold 24px sans-serif");
            }
        }
        else if (key.key == "Escape") {
            if (cocoDialogueIndex == -1) {
                cocoDialogueIndex = 2;
                draw();     
                drawCocoDialogueBubble();
                writeText(text["coco"][cocoDialogueIndex][language], canvas_horizontal_center, canvas_vertical_center + 75, "#000000", "bold 24px sans-serif");
            } 
            else if (cocoDialogueIndex == 2) {
                state = states.OUTSIDE;
                barCocoAudio.pause();
                barCocoAudio.currentTime = 0;
                currentImage = null; 
            }
            else {
                draw();
                cocoDialogueIndex = -1;
            }
        }
    }
    else if (state == states.KARAOKE_MENU) {
        if (key.key == "ArrowUp") {
            if (song_list_index != 1) {
                song_list_index--;
                draw();
                writeSongList();
            }
        }
        else if (key.key == "ArrowDown") {
            if (song_list_index != songList.length - 2) {
                song_list_index++;
                draw();
                writeSongList();
            }
        }
        else if (key.key == "Enter") {
            state = states.KARAOKE_SONG;
            currentSong = songList[song_list_index][0];
            if (currentSong == "24 Hour Cinderella") {
                currentKaraokeSongImgs = karaokeSongEyepatchImgs;
            }
            else {
                currentKaraokeSongImgs = karaokeSongYakuzaImgs;
            }
            currentImage = null;
        }
        else if (key.key == "Escape") {
            state = states.BAR;
            currentSong = null;
            currentImage = null;
            cocoDialogueIndex = -1;
            barCocoAudio.play();
        }
    }
    else if (state == states.KARAOKE_SONG) {
        if (key.key == " ") {
            state = states.KARAOKE_PAUSE;
            songsToElement[currentSong]["audio"].pause();
            writeText(language == "en" ? "PAUSED" : "一時停止", canvas_horizontal_center, canvas_vertical_center - 40, "#000000", "bold 40px sans-serif");
        }
    }
    else if (state == states.KARAOKE_PAUSE) {
        if (key.key == " ") {
            state = states.KARAOKE_SONG;
            frameCount = 0;
            songsToElement[currentSong]["audio"].play(); 
            draw();
            writeText(songsToElement[currentSong]["lyrics"][currentLyric][language], canvas_horizontal_center, canvas_vertical_center - 100, "#000000", "bold 28px sans-serif");
        }
        else if (key.key == "Escape") {
            state = states.BAR;
            songsToElement[currentSong]["audio"].currentTime = 0;
            currentSong = null;
            currentImage = null;
            frameCount = 0;
            cocoDialogueIndex = -1;
            currentKaraokeSongImgs = null;
            barCocoAudio.play();
        }
    }
}

// 1000 / 30 will be "30 fps"
var updateInterval = setInterval(update, framerate);