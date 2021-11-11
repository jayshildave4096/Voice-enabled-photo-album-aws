var checkout = {};

$(document).ready(function(){  
  });
  
//HELPER FUNCTIONS

function uploadImage(){
    const file = document.querySelector('input[type=file]').files[0];
    const reader= new FileReader();
    reader.addEventListener("load", function () {
        body=reader.result;
		var bytes = []; 
		var bytesv2 = []; 

		for (var i = 0; i < body.length; ++i) {
			var code = body.charCodeAt(i);

			bytes = bytes.concat([code]);

			bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
		}
        sdk.uploadPut({},bytes,{}).then((response) => {
                console.log(response);
            })
            .catch((error) => {
                alert('an error occurred', error);
            });
      }, false);
    
      if (file) {
        reader.readAsDataURL(file);
      }
   
    
}

// Load all images at start
$(window).load(function() {
var row=document.getElementById('image-array')
num_rows=3;
num_columns=4;
for(i=0;i<num_rows;i++){
    var new_row=document.createElement('div');
    new_row.className= 'row';
    for(j=0;j<num_columns;j++){
        var col=document.createElement('div')
        col.className="col-2";
        col.style="padding:5px;";
        new_row.appendChild(col);
        var img=document.createElement('img');
        img.className="img-thumbnail";
        img.setAttribute('src', './assets/img/temp.png');
        img.setAttribute('height', '200px');
        img.setAttribute('width', '200px');
        col.appendChild(img);
    }
    row.appendChild(new_row);
}
});

function insert_tags(){
var input = document.getElementById("input-tags");
var ul = document.getElementById("input-tag-list"); 

if (input.value!= ""){
    var li = document.createElement("li");
    li.className = 'list-group-item';
    li.textContent = input.value;
    ul.appendChild(li);
}   
}


function insert_search_tags(){
var input = document.getElementById("search-tags");
var ul = document.getElementById("search-tag-list"); 
if (input.value!= ""){
    var li = document.createElement("li");
    li.className = 'list-group-item';
    li.textContent = input.value;
    ul.appendChild(li);
}

}

function validate_File(){

}


function loadImages(){

}

function searchImages(){
    sdk.searchGet({q:""},undefined,undefined).then((response) => {
        console.log(response);
    })
    .catch((error) => {
        alert('an error occurred', error);
    });
}
