$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
});


function callAPI(apicategory, offset) {
    debugger;

    // placeholderqueryURL for  API
    //need a try catch block for errors
    // Constructing a URL to search for the job
    var queryURL =
        "https://jobs.github.com/positions.json?description=" +
        skillName +
        "&location=" +
        location +
        "&page=1";


    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        error: function(err) {
            console.log(err);
            alert("Jobs requested could not be returned");
        },
    }).then(function(response) {
        //return the response
        // return response.data;
        debugger;
        console.log(response);
        console.log(response.data);
        requiredArray = response.data;
        console.log(requiredArray.length);
        for (var i = 0; i < requiredArray.length; i++) {
            renderJobCards(
                requiredArray[i].company,
                requiredArray[i].url,
                requiredArray[i].create_at
            );
            globalJobs = globalJobs + 1;

        }

    });

};


$(document).on("click", ".search-btn", function() {
    debugger;
    //reset divs and the global variables
    $(".display-jobs").empty();
    console.log("display-jobs-section");
    //get the search parameters
    const searchSkill = $("#searchFormSkill").val().trim();
    const searchLocation = $("#searchFormLocation").val().trim();
    const fullTime = $("searchFormPosition").children("option:selected").val()

    console.log(searchSkill, searchLocation, fullTime)

    callAPI(searchSkill, searchLocation, fullTime);

});