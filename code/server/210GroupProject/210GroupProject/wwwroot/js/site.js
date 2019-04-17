
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
// $.get("/api/lists", function (data) {
//     console.log(data); 
// });

window.onload = function () {
    //if no user, clear new user 
    if (localStorage.getItem("user") == null) {
        $(function () {
            $("#dialog").dialog();
        });
    } else {
        $("#dialog").remove(); 
    }
}

/// REGISTERING USER DIALOG 

function registerUser() {
    const userName = $("#userName").val();
    let obj = { "id": 0, "name": userName };
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj),
        url: "api/user/",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    })
        .done(function (data) {
            localStorage.setItem("user", data);
            $("#dialog").dialog('close');
        });
}


let categories =[]; 

function append_value(e){ 
    if (categories[categories.indexOf(e.id)]!=e.id){
        categories.push(e.id); 
        button_selected(e.id, 1); 
    } else {
        categories.splice(categories.indexOf(e.id),1); 
        button_selected(e.id, 2);
    }
}

function button_selected(id,control){   
    var button = $(`#${id}`); 
    if (control == 1){
        button.css("background-color","#5A6268");
        button.css("color","#FFF");
    } else {
        button.css("background-color","#E2E6EA");
        button.css("color","#000");
    }
}
function doSearch() {
    $('.searchResultBox').empty(); 

    const term = $("#term").val();  
    const location = $("#location").val();
    const url = `api/yelp?term=${term}&location=${location}&categories=${categories.toString()}`;
    $.get(url, function (data) {
        const datajs = JSON.parse(data);
        const businesses = datajs.businesses;
        var resultCount = `<div><h5>${businesses.length} results for <strong>${term} - ${categories.toString()}</strong></h5 ></div >`; 
        $('.searchResultBox').append(resultCount);
        businesses.map((value, index) => {
            var div = `<div id="item" class="item-display">
            <img class="itemImage" src="${value.image_url}" alt="${value.name}">
            <div class="description">
                <div>
                    <p class="store-title">${value.name}</p>
                    <p>Rating: ${value.rating} | Price: ${value.price}</p>
                    <p>Phone: ${value.display_phone} </p>
                    <p>Address: ${value.location.display_address.toString()} </p >
                </div>
            </div>
            <div class="btn-section">
                <a type="button" class="btn btn-dark btn-sm link" href=${value.url} target="_blank" >View Restaurant</a>
                <button type="button" class="btn btn-dark btn-sm">Add to list</button>
            </div>
        </div>`; 
            $('.searchResultBox').append(div);
        })
    });
}


