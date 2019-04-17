window.onload = function () {
    //if no user, create new user 
    if (localStorage.getItem("user") == null) {
        $(function () {
            $("#dialog").dialog();
        });
    } else {
        $("#dialog").remove();
    }

    // get all the lists created by the user and save them local storage. 
    const user = localStorage.getItem("user");
    getUserLists(parseInt(user));
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

function getUserLists(userid) {
    $.get(`api/lists/${userid}`, (data) => {
        let lists = [];
        data.map((value, index) => {
            let list = {
                id: value.id,
                title: value.listTitle
            };
            lists.push(list);
        })
        localStorage.setItem("lists", JSON.stringify(lists));
    });
}


let categories = [];
function append_value(e) {
    if (categories[categories.indexOf(e.id)] != e.id) {
        categories.push(e.id);
        button_selected(e.id, 1);
    } else {
        categories.splice(categories.indexOf(e.id), 1);
        button_selected(e.id, 2);
    }
}

function button_selected(id, control) {
    var button = $(`#${id}`);
    if (control == 1) {
        button.css("background-color", "#5A6268");
        button.css("color", "#FFF");
    } else {
        button.css("background-color", "#E2E6EA");
        button.css("color", "#000");
    }
}

function doSearch() {
    $('.searchResultBox').empty();
    const term = $("#term").val();
    const location = $("#location").val();
    const url = `api/yelp?term=${term}&location=${location}&categories=${categories.toString()}`;

    let lists = JSON.parse(localStorage.getItem("lists"));

    $.get(url, function (data) {
        const datajs = JSON.parse(data);
        const businesses = datajs.businesses;
        var resultCount = `<div><h5>${businesses.length} results for <strong>${term}</strong></h5 ></div >`;
        $('.searchResultBox').append(resultCount);
        let places = [];
        businesses.map((value, index) => {
            var div = `<div id="${value.id}" class="item-display item">
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
                <div style="margin-top:15px">
                    <select class="btn btn-dark btn-sm" id="${value.id}*">
                        <option value="" selected disabled hidden>Add to list</option>
                        ${lists.map((list, index) => `<option value=${list.id} id="${value.id}--"  onclick="addPlace(this)">${list.title}</option>`)}
                        <option value="">Create New List</option>
                   </select>
                </div>
            </div>`;
            $('.searchResultBox').append(div);
            let place = {
                id: value.id,
                data: value
            };
            places.push(place);
        });
        localStorage.setItem("places", JSON.stringify(places));
    });
}


function addPlace(e) {
    let yelpId = $(`#${e.id}`).parent().attr("id").replace("*", "");
    let places = JSON.parse(localStorage.getItem("places"));
    let place;
    places.forEach(element => {
        if (element.id == yelpId)
            place = element;
    });
    let listId = parseInt(e.value);
    let placeToAdd = {
        "id": 0,
        "yelpId": yelpId,
        "listId": listId,
        "name": place.data.name,
        "address": place.data.location.display_address.toString(),
        "phone": place.data.display_phone,
        "rating": Math.round(place.data.rating),
        "priceRange": place.data.price,
        "url": place.data.url,
        "imageURL": place.data.image_url
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(placeToAdd),
        url: "api/place",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    })
        .done(function (data) {
            console.log(data);
        });
}