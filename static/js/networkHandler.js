export let networkHandler = {

    /* Get data from server with fetch API and pass the data to callback function */
    getData: function (route, callback) {
        fetch(route)
            .then(response => response.json())
            .then(data => callback(data))
    },

    /* Send data to server in json with fetch API post request and call callback function*/
    sendData: function (data, route, callback) {
        fetch(`${route}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => {
                callback(response);
            })
    },

    /* Redirect to home page*/
    redirectHome: function (r) {
        if (r.status === 200) window.location = '/';
    }
}