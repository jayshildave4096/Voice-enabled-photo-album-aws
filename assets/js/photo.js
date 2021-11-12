var checkout = {};
var noteContent = "";
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
	  col.className = "col-2";
	  col.style = "padding:5px;";
	  new_row.appendChild(col);
	  var img = document.createElement("img");
	  img.className = "img-thumbnail";
	  img.setAttribute(
		"src",
		`https://hw2-ccbd-b2.s3.amazonaws.com/${images[i]}`
	  );
	  img.setAttribute("height", "200px");
	  img.setAttribute("width", "200px");
	  col.appendChild(img);
	}
	row.appendChild(new_row);
  } else {
	for (i = 0; i < num_rows; i++) {
	  var new_row = document.createElement("div");
	  new_row.className = "row";
	  for (j = 0; j < 4; j++) {
		var col = document.createElement("div");
		col.className = "col-2";
		col.style = "padding:5px;";
		new_row.appendChild(col);
		var img = document.createElement("img");
		img.className = "img-thumbnail";
		img.setAttribute(
		  "src",
		  `https://hw2-ccbd-b2.s3.amazonaws.com/${images[k]}`
		);
		img.setAttribute("height", "200px");
		img.setAttribute("width", "200px");
		col.appendChild(img);
		k++;
	  }
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
// function uploadPhoto() {
//     let imgFile = document.getElementById("file_path").files[0]
//     reader = new FileReader()
//     reader.onload = function(e) {
//       console.log("Here")
//       var params = {
//         "x-api-key": "WnqHXLguUU3sf7qGMjmOLaRCD3gmg89J7VyE8qvG",
//         "file-name": imgFile.name,
//         "Content-Type": imgFile.type,
//         "bucket": "nm3223.voice-photo-album.b2.w6998.ccbd.f2021",
//         "x-amz-meta-customLabels": document.getElementById("uploadText").value
//       }
//       var apigClient = apigClientFactory.newClient({
//         "apiKey": "WnqHXLguUU3sf7qGMjmOLaRCD3gmg89J7VyE8qvG"
//       })
//       apigClient.uploadPut(params, Uint8Array(e.target.result),{}).then(function(res) {
//         console.log(res.status)
//         if(res.status == 200) {
//           document.getElementById("fileName").innerHTML = "File Upload Complete"
//         }
//       })

//     }
//     reader.readAsArrayBuffer(imgFile)
//   }

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
  console.log("Voice recognition paused.");
}

function validate_File() {}

function loadImages() {}
