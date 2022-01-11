let audio = document.getElementById("audio");
let audio_url = document.getElementById("audio_url");
let set_audio_url = document.getElementById("set_audio_url");
let origin_box = document.getElementById("origin_box");
let trans_box = document.getElementById("trans_box");
let origin = document.getElementById("origin");
let trans = document.getElementById("trans");
let edit_btn = document.getElementById("edit_mode");
let insert_btn = document.getElementById("insert_mode");
let insert_time_btn = document.getElementById("insert_time");
let export_vrc = document.getElementById("export_vrc");

let origin_text_line = null;
let trans_text_line = null;

let origin_text = [];
let trans_text = [];

let text_index = 0;

origin.addEventListener("input", () => {
    origin_text = origin.value.split(/[(\r\n)\r\n]+/);
});

trans.addEventListener("input", () => {
    trans_text = trans.value.split(/[(\r\n)\r\n]+/);
})

set_audio_url.onclick = () => {
    audio.src = audio_url.value;
}

let createLineBox = () => {
    origin_text_line = document.createElement("div");
    origin_text_line.id = "origin_text_line";
    origin_box.appendChild(origin_text_line);
    trans_text_line = document.createElement("div");
    trans_text_line.id = "trans_text_line";
    trans_box.appendChild(trans_text_line);
}

let createLyricLine = (elementId, arr) => {
    for (let i = 0; i < arr.length; i++) {
        let text_line = document.createElement("div");
        text_line.id = elementId.id + "_" + i;
        text_line.innerHTML = arr[i];
        elementId.appendChild(text_line);
    }

    document.getElementById(elementId.id + "_0").setAttribute("class", "text_line_highlight");
}


let timeToMinute = (times) => {
    let t;
    if (times > -1) {
        let min = Math.floor(times / 60) % 60;
        let sec = times % 60;

        if (min < 10) { t = "0"; }
        t += min + ":";
        if (sec < 10) { t += "0"; }
        t += sec.toFixed(6);
    }
    t = t.substring(0, t.length - 3);
    return t;
}

edit_btn.onclick = () => {
    edit_btn.disabled = true;
    insert_btn.disabled = false;
    insert_time_btn.disabled = true;

    origin.style.display = "block";
    trans.style.display = "block";

    origin_text_line.remove();

    if (trans_text_line !== null) {
        trans_text_line.remove();
    }
}

insert_btn.onclick = () => {
    insert_btn.disabled = true;
    insert_time_btn.disabled = false;
    edit_btn.disabled = false;

    origin.style.display = "none";
    trans.style.display = "none";

    createLineBox();

    createLyricLine(origin_text_line, origin_text);

    if (trans_text.length > 0) {
        createLyricLine(trans_text_line, trans_text);
    }
}

insert_time_btn.onclick = () => {
    origin_text[text_index] = "[" + timeToMinute(audio.currentTime) + "]" + origin_text[text_index];
    document.getElementById("origin_text_line_" + text_index).innerHTML = origin_text[text_index];
    document.getElementById("origin_text_line_" + text_index).classList.remove("text_line_highlight");


    trans_text[text_index] = "[" + timeToMinute(audio.currentTime) + "]" + trans_text[text_index];
    document.getElementById("trans_text_line_" + text_index).innerHTML = trans_text[text_index];
    document.getElementById("trans_text_line_" + text_index).classList.remove("text_line_highlight");

    text_index++;

    if (text_index !== origin_text.length) {
        document.getElementById("origin_text_line_" + text_index).classList.add("text_line_highlight");
        if (trans_text.length > 0) {
            document.getElementById("trans_text_line_" + text_index).classList.add("text_line_highlight");
        }
    } else {
        insert_time_btn.disabled = true;
    }
}

export_vrc.onclick = () => {
    let vrcdata = {
        "karaoke": false,
        "scrollDisabled": false,
        "translated": trans_text.length > 0 ? true : false,
        "origin": {
            "version": 2,
            "text": origin_text.join("\n")
        },
        "translate": {
            "version": 2,
            "text": trans_text.length > 0 ? trans_text.join("\n") : ""
        }
    }

    var blob = new Blob([JSON.stringify(vrcdata)], { type: "" });
    saveAs(blob, "Export.vrc");
}
