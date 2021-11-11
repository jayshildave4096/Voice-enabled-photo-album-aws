var checkout = {};
var noteContent = "";

try {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  console.error(e);
  $(".no-browser-support").show();
  $(".app").hide();
}

$(document).ready(function () {});

window.onload = function () {
  var searchtext = "";

  var body = {};
  var params = { q: searchtext };
  var additionalParams = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  };
  sdk
    .searchGet(params, body, additionalParams)
    .then(function (res) {
      console.log(res);
    })
    .catch(function (result) {});
};
var searchquery = document.getElementById("search-query");
/*-----------------------------
      Voice Recognition
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function (event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;

  if (!mobileRepeatBug) {
    noteContent += transcript;
    searchquery.value = noteContent;
  }
};

recognition.onstart = function () {
  console.log("Voice recognition activated. Try speaking into the microphone.");
};

recognition.onspeechend = function () {
  console.log(
    "You were quiet for a while so voice recognition turned itself off."
  );
};

recognition.onerror = function (event) {
  if (event.error == "no-speech") {
    console.log("No speech was detected. Try again.");
  }
};

//HELPER FUNCTIONS

function uploadImage() {
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      body = reader.result;
      var bytes = [];
      var bytesv2 = [];

      for (var i = 0; i < body.length; ++i) {
        var code = body.charCodeAt(i);

        bytes = bytes.concat([code]);

        bytesv2 = bytesv2.concat([code & 0xff, (code / 256) >>> 0]);
      }
      sdk
        .uploadPut({}, bytes, {})
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          alert("an error occurred", error);
        });
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Load all images at start
$(window).load(function () {
  var row = document.getElementById("image-array");
  num_rows = 3;
  num_columns = 4;
  for (i = 0; i < num_rows; i++) {
    var new_row = document.createElement("div");
    new_row.className = "row";
    for (j = 0; j < num_columns; j++) {
      var col = document.createElement("div");
      col.className = "col-2";
      col.style = "padding:5px;";
      new_row.appendChild(col);
      var img = document.createElement("img");
      img.className = "img-thumbnail";
      img.setAttribute("src", "./assets/img/temp.png");
      img.setAttribute("height", "200px");
      img.setAttribute("width", "200px");
      col.appendChild(img);
    }
    row.appendChild(new_row);
  }
});

function insert_tags() {
  var input = document.getElementById("input-tags");
  var ul = document.getElementById("input-tag-list");

  if (input.value != "") {
    var li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = input.value;
    ul.appendChild(li);
  }
}

function startRecording() {
  if (noteContent.length) {
    noteContent += " ";
  }
  recognition.start();
  console.log("Voice recognition started.");
}

function changeText() {
  noteContent = $(this).val();
  console.log(noteContent);
}

function stopRecording() {
  recognition.stop();
  console.log("Voice recognition paused.");
}

function validate_File() {}

function loadImages() {}
