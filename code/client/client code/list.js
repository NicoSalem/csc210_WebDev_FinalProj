
window.onload = function() {

    var connection = new signalR.HubConnectionBuilder().withUrl("/listHub").build();

    connection.start().then(function() {
        console.log("Successfully connected to the hub.");
    })
    .catch(function(err) {
        console.log("There is a connection error.");
    });

}
