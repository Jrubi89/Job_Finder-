// $('#myModal').on('shown.bs.modal', function() {
//     $('#myInput').trigger('focus')
// });

//------------------------------------------------------------------------------


$(document).ready(function () {

    $("#search").hide();
    $("#userGreeting").hide();

    let userName = window.localStorage.getItem("username")


    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // When the user clicks the button, open the modal 

    btn.onclick = function () {

        modal.style.display = "block";
    }

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal

    span.onclick = function () {

        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //Adding click actions for "Continue"

    var button = document.getElementById("options1");


    button.onclick = function () {
        $("#search").show();
        $(".modal-content").hide();
        $("#myBtn").hide();
        $("#userGreeting").show();
        

        let personsName = $("#userName").val()
        window.localStorage.setItem("username", personsName)

        console.log("Welcome, " + personsName)

        $("#userGreeting").append("Welcome, " + personsName)


    }

    


}); // Ends document ready


//------------------------------------------------------------------------------------------------
var globalJobs = 0;

function renderJobCards(iCompany, iCUrl, iUrl, iCreated_at, iDescription, iLocation, iTitle) {
    var cardDiv = '<div class="row"><div class="card w-80"><div class="card-header"><a target="_blank" rel="noopener noreferrer" href = "' + iCUrl + '"class = "card-link"><h3 class="card-title">' + iCompany + '</h3></a></div><div class="card-body"><h3>' + iTitle + '</h3><h3>' + iLocation + '</h3><p class="card-text">' + iDescription.substring(0, 500) + '</p><form action="' + iUrl + '" target="_blank"><button type="submit">Read more</button></form></div><div class="card-footer">Created on: ' + iCreated_at + ' </div></div>'
    var breakDiv = '<div class="row"><br/></div>'
    $(".displaycards").append(cardDiv);
    $(".displaycards").append(breakDiv);
}

function checkandReplaceSpaces(stringToFormat) {
    stringToFormat = stringToFormat.trim()
    stringToFormat.replace(/\s/g, "+")
    console.log(stringToFormat)
    return stringToFormat
}

//RBDfunction zipcodeToLocation(stringToCheck) {
// }

function callAPI(skillName, jobLocation, fullTime, offset) {
    // Constructing a URL to search for the job
    var queryURL =
        "https://jobs.github.com/positions.json?"


    //TBD get job Locations from zipcodes
    //TBDjoblocation = zipcodeToLocation(joblocation)
    if (jobLocation) {
        jobLocation = checkandReplaceSpaces(jobLocation)
        if (queryURL[queryURL.length - 1] === "?") {
            queryURL = queryURL + "location=" + jobLocation
        } else {
            queryURL = queryURL + "&location=" + jobLocation

        }
    }
    if (skillName) {
        if (queryURL[queryURL.length - 1] === "?") {
            queryURL = queryURL + "description=" + skillName
        } else {
            queryURL = queryURL + "&description=" + skillName

        }
    }
    var fulltime_bool = false
    if (fullTime) {
        if (fullTime === "Full Time") {
            fulltime_bool = true
        }
    }
    if (queryURL[queryURL.length - 1] === "?") {
        queryURL = queryURL + "full_time=" + fulltime_bool
    } else {
        queryURL = queryURL + "&full_time=" + fulltime_bool

    }
    queryURL = queryURL + "&page=" + offset;


    //need a try catch block for errors


    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        error: function (err) {
            console.log(err);
            alert("Jobs requested could not be returned");
        },
    }).then(function (response) {
        //return the response

        //initialize to 0
        globalJobs = 0;

        console.log(response);
        requiredArray = response;
        console.log(requiredArray.length);
        //reset divs and the global variables
        $(".displaycards").empty();
        var breakDiv = '<div class="row"><br/></div>'
        $(".displaycards").append(breakDiv);
        for (var i = 0; i < requiredArray.length; i++) {
            renderJobCards(
                requiredArray[i].company,
                requiredArray[i].company_url,
                requiredArray[i].url,
                requiredArray[i].created_at,
                requiredArray[i].description,
                requiredArray[i].location,
                requiredArray[i].title
            );
            globalJobs = globalJobs + 1;

        }


    });

};


$(document).on("click", "#search-btn", function () {
    console.log("display-jobs-section");
    debugger
    //get the search parameters
    const searchSkill = $("#searchFormSkill").val().trim();
    const searchLocation = $("#searchFormLocation").val().trim();
    const fullTime = $("#searchFormPosition").children("option:selected").val()

    console.log(searchSkill, searchLocation, fullTime)

    callAPI(searchSkill, searchLocation, fullTime);

});
