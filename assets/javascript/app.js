$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
});

var globalJobs = 0;

function renderJobCards(iCompany, iUrl, iCreated_at, iDescription) {
    var cardDiv = '<div class="row"><div class="card"><div class="card-body"><h4 class="card-title">' +
        iCompany + '</h4><p class="card-text">' + iDescription.substring(0, 100) +
        '</p> <button type="button" class="btn btn-light-blue btn-md">Read more</button></div></div></div>';
    $(".displaycards").append(cardDiv);
}

function callAPI(skillName, jobLocation, fullTime, offset) {
    debugger;

    // placeholderqueryURL for  API
    //need a try catch block for errors
    // Constructing a URL to search for the job
    var queryURL =
        "https://jobs.github.com/positions.json?description=" +
        skillName +
        "&location=" +
        jobLocation +
        "&full_time=" +
        fullTime + "&page=" + offset;


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
        debugger;
        //initialize to 0
        globalJobs = 0;

        console.log(response);
        requiredArray = response;
        console.log(requiredArray.length);
        for (var i = 0; i < requiredArray.length; i++) {
            renderJobCards(
                requiredArray[i].company,
                requiredArray[i].url,
                requiredArray[i].created_at,
                requiredArray[i].description

            );
            globalJobs = globalJobs + 1;

        }


    });

};


$(document).on("click", "#search-btn", function() {
    debugger;
    //reset divs and the global variables
    $(".displaycards").empty();
    console.log("display-jobs-section");
    //get the search parameters
    const searchSkill = $("#searchFormSkill").val().trim();
    const searchLocation = $("#searchFormLocation").val().trim();
    const fullTime = $("searchFormPosition").children("option:selected").val()

    console.log(searchSkill, searchLocation, fullTime)

    callAPI(searchSkill, searchLocation, fullTime);

});