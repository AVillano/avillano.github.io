const states = {
    OUTSIDE: "outside",
    BAR: "bar",
    KARAOKE_MENU: "karaoke_menu",
    KARAOKE_SONG: "karaoke_song",
    KARAOKE_PAUSE: "karaoke_pause",
    FADE_TO_BAR: "fade_to_bar"
};

const text = {
    "enter": {"en": "Press Enter", "jp": "「Enter」を押して"},
    "select_song": {"en": "Select a Song", "jp": "曲を選んでください"},
    "coco": {
        0: {"en": "Welcome to Bar Coco!", "jp": "いらっしゃいませ!"},
        1: {"en": "Would you like to try some karaoke?", "jp": "カラオケをしたいですか?"},
        2: {"en": "Thank you for coming to Bar Coco.", "jp": "BarCocoに来てくれてありがとうございました。"},
        3: {"en": "Nice job. You have good taste.", "jp": "ナイス。歌の好みがいいですね。"}
    }
};

const songList = [
    ["", ""],
    ["MachineGun Kiss", "MACHINEGUN KISS"],
    ["Judgement", "JUDGEMENT"],
    ["24 Hour Cinderella", "24時間シンデレラ"],
    ["Baka Mitai", "ばかみたい"],
    ["", ""]
];