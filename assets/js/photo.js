var checkout = {};
var noteContent = "";
var custom_tags = [];

var searchquery = document.getElementById("search-query");
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
  var searchtext = searchquery.value;
  var images = [];
  var params = {
    "x-api-key": "WXvq5zPz9YkBLVPJx0aH8ECo6FDGEfH7FAHMqmS6",
    q: searchtext,
  };
  sdk.searchGet(params, {}, {}).then(function (res) {
    images = res.data;
    generateArray(images);
  });
};

function generateArray(images) {
  console.log(images);
  var row = document.getElementById("image-array");
  num_rows = images.length / 4;
  num_columns = 4;
  k = 0;
  if (images.length <= 4) {
    console.log("here");
    var new_row = document.createElement("div");
    new_row.className = "row";
    for (i = 0; i < images.length; i++) {
      var col = document.createElement("div");
      col.className = "col-3";
      col.style = "padding:5px;";
      new_row.appendChild(col);
      var img = document.createElement("img");
      img.className = "img-thumbnail";
      img.setAttribute(
        "src",
        `https://hw2-ccbd-b2.s3.amazonaws.com/${images[i]}`
      );
      img.setAttribute("height", "400px");
      img.setAttribute("width", "400px");
      col.appendChild(img);
    }
    row.appendChild(new_row);
  } else {
    var new_row=document.createElement("div");
	new_row.className = "row";
    for (i = 1; i <=images.length; i++) {
      if (i % 3 == 0) {
        new_row = document.createElement("div");
        new_row.className = "row";
	   } 
        var col = document.createElement("div");
        col.className = "col-2";
        col.style = "padding:5px;";
        new_row.appendChild(col);
        var img = document.createElement("img");
        img.className = "img-thumbnail";
        img.setAttribute(
          "src",
          `https://hw2-ccbd-b2.s3.amazonaws.com/${images[i-1]}`
        );
        img.setAttribute("height", "200px");
        img.setAttribute("width", "200px");
        col.appendChild(img);
        row.appendChild(new_row);
      
    }
  }
}

function searchImages() {
  var array = document.getElementById("image-array");
  while (array.firstChild) {
    array.removeChild(array.firstChild);
  }
  var searchtext = searchquery.value;
  var images = [];
  var params = {
    "x-api-key": "WXvq5zPz9YkBLVPJx0aH8ECo6FDGEfH7FAHMqmS6",
    q: searchtext,
  };
  sdk.searchGet(params, {}, {}).then(function (res) {
    images = res.data;
    generateArray(images);
  });
}

recognition.continuous = true;

recognition.onresult = function (event) {
  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;

  if (!mobileRepeatBug) {
    noteContent += transcript;
    searchquery.value = noteContent;
	noteContent="";
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
  var file = document.getElementById("file").files[0];
  const reader = new FileReader();

  var encoded_image = getBase64(file).then((data) => {
    console.log(file.name);
    var body = data;
    var params = {
      "x-api-key": "WXvq5zPz9YkBLVPJx0aH8ECo6FDGEfH7FAHMqmS6",
      "file-name": file.name,
      "Content-Type": file.type + ";base64",
      bucket: "hw2-ccbd-b2",
      "x-amz-meta-customLabels": "",
    };
    var additionalParams = {};
    sdk.uploadPut(params, body, additionalParams).then(function (res) {
      console.log(res);
      if (res.status == 200) {
        alert("File Uploaded Successfully");
      }
      searchquery.value = "";
      // searchImages();
      window.location.reload();
    });
  });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

function insert_tags() {
  var input = document.getElementById("input-tags");
  var ul = document.getElementById("input-tag-list");

  if (input.value != "") {
    var li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = input.value;
    custom_tags.push(input.value);
    ul.appendChild(li);
  }
}

function startRecording() {
  searchquery.value = "";
  if (noteContent.length) {
    noteContent += " ";
  }
  recognition.start();
  console.log("Voice recognition started.");
}

function changeText() {
  noteContent = searchquery.value;
}

function stopRecording() {
  recognition.stop();
  searchquery.value = "";
  console.log("Voice recognition paused.");
}

function validate_File() {}

function loadImages() {}
