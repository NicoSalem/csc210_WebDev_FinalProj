// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
// $.get("/api/lists", function (data) {
//     console.log(data); 
// });

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

function doSearch(){
    const term = $("#term").val();  
    const location = $("#location").val();
    const url = `api/yelp?term=${term}&location=${location}&categories=${categories.toString()}`;
   
    $.get(url, function (data) {
        const datajs = JSON.parse(data);
        const businesses = datajs.businesses;
        businesses.map((value, index) => {
            var div =
                `<div class="col-md-4">
                     <img src=${value.image_url} height=175px width=175px/>
                </div>
                <div class="col-md-8">
                     <p>${value.name}</p>
                     <p>${value.rating}</p>
                     <p>${value.price}</p>
                     <p>${value.display_phone}</p>
                     <p>${value.location.display_address.toString()}</p>
                </div>
                `; 
            $('.json').append(div); 
        })
    });
}