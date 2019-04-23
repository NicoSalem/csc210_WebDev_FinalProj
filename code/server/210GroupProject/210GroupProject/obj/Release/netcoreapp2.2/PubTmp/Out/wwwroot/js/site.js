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

    //load lists when in listshub 
    if (window.location.toString().includes("listshub")) {
        loadAllLists();
    }

    if (window.location.toString().includes("listview")) {
        loadPlaces();
    }

    if (window.location.toString().includes("mylists")) {
        loadUserLists();
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
            window.location.reload();
        });
}

function getUserLists(userid) {
    $.get(`api/lists/${userid}`, (data) => {
        let lists = [];
        data.lists.map((value, index) => {
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
            var div = createPlaceDiv(lists, value);
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

function createPlaceDiv(lists, value) {
    let div = `<div id="${value.id}" class="item-display item">
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
                        <option value="" onclick="createNewList()">Create New List</option>
                   </select>
                </div>
            </div>`;
    return div;
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
        });
}

function createNewList() {
    console.log("clicked");
    var createListDialog = `
    <div id="createListDialog">
        <label for="listName" style="color: black;">Please enter list name</label>
        <input type="text" name="listName" id="listName" value="" class="text ui-widget-content ui-corner-all">
        <button class="btn btn-success" id="registerUser" onclick="postList()">Create List</button>
    </div>
    `;
    $("#search-wrap").append(createListDialog);
    $("#createListDialog").dialog();
}

function postList() {
    let userId = parseInt(localStorage.getItem("user"));
    let listName = $("#listName").val();
    let listToAdd = {
        "userId": userId,
        "listTitle": listName
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(listToAdd),
        url: "api/lists",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    })
        .done(function (data) {
            $("#createListDialog").dialog('close');
            window.location.reload();
        });
}

function loadAllLists() {
    $.get("api/lists", (data) => {
        appendAllLists(data);
    })
}

function loadUserLists() {
    let user = parseInt(localStorage.getItem("user"));
    $.get(`api/lists/${user}`, (data) => {
        appendAllLists(data);
    })
}

function appendAllLists(data) {
    let lists = data.lists;
    let thumbs = data.thumb;
    let parentDiv = $(".all-lists");
    let userId = parseInt(localStorage.getItem("user"));
    for (i = 0; i < lists.length; i++) {
        let list = lists[i];
        let listThumbs = thumbs[i];
        var div =
            `
        <div class="lists-view">
            <div class="row" style="margin-top:10px;">
                <div class="col-md-9"> <span class="list-name">${list.listTitle}</span></div>
                <div class="col-md-3">
                <button class="btn btn-info" id=${list.id} onclick=viewList(this)>View List</button>
                ${checkUnpublished(userId, list)}
                </div>
            </div>
            <div class="row">
                ${addImgs(listThumbs)}
            </div>
            <div class="row" style="margin: 10px 10px 10px 10px;">
                <div class="col-md-12">Prepared by: ${list.user.name}</div>
            </div>
        </div>
        `;
        parentDiv.append(div);
    }
}

function checkUnpublished(userid, list) {
    if (list.userId == userid && !list.isPublished) {
        return `<button class="btn btn-success" id=${list.id} onclick="publishList(this)">Publish List</button>`;
    }
    return "";
}

function addImgs(listThumbs) {
    let div = "";
    listThumbs.map((img, index) => {
        let imgDiv =
            `<div class="col-md-3"><img src=${img} class="thumb" /></div>`;
        div += imgDiv;
    });
    return div;
}

function viewList(e) {
    localStorage.setItem("listToView", e.id);
    window.location.href = "listview.html";
}

function loadPlaces() {
    let listId = parseInt(localStorage.getItem("listToView"));
    let lists = JSON.parse(localStorage.getItem("lists"));

    $.get(`api/list/${listId}`, (data) => {
        $('.listTitle').append(`<p>${data.listTitle}</p>`);
        $('#prepared').append(`<p>Prepared by: ${data.user.name}</p>`);
        const businesses = data.places;
        let places = [];
        businesses.map((value, index) => {
            var div = createPlaceDivForList(lists, value);
            $('.listPlaces').append(div);
            let place = {
                id: value.yelpId,
                data: value
            };
            places.push(place);
        });
        localStorage.setItem("places", JSON.stringify(places));
    })
}

function createPlaceDivForList(lists, value) {
    let div = `<div id="${value.yelpId}" class="item-display item">
            <img class="itemImage" src="${value.imageURL}" alt="${value.name}">
            <div class="description">
                <div>
                    <p class="store-title">${value.name}</p>
                    <p>Rating: ${value.rating} | Price: ${value.priceRange}</p>
                    <p>Phone: ${value.phone} </p>
                    <p>Address: ${value.address} </p >
                </div>
            </div>
            <div class="btn-section">
                <a type="button" class="btn btn-dark btn-sm link" href=${value.url} target="_blank" >View Restaurant</a>
                <div style="margin-top:15px">
                    <select class="btn btn-dark btn-sm" id="${value.yelpId}*">
                        <option value="" selected disabled hidden>Add to list</option>
                        ${lists.map((list, index) => `<option value=${list.id} id="${value.yelpId}--"  onclick="addPlaceOfAnotherList(this)">${list.title}</option>`)}
                        <option value="" onclick="createNewList()">Create New List</option>
                   </select>
                </div>
            </div>`;
    return div;
}


function addPlaceOfAnotherList(e) {
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
        "address": place.data.address,
        "phone": place.data.phone,
        "rating": Math.round(place.data.rating),
        "priceRange": place.data.priceRange,
        "url": place.data.url,
        "imageURL": place.data.imageURL
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
        });
}

function publishList(e) {
    let listId = e.id;
    $.get(`api/list/publish/${listId}`, (data) => {
        localStorage.setItem("listToView", listId);
        window.location.href = "listview.html";
    });
}