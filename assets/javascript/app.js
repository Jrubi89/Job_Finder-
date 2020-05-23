$(document).ready(function() {
    $("#search").hide();
    $("#userGreeting").hide();


    let userName = window.localStorage.getItem("username")

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // When the user clicks the button, open the modal

    btn.onclick = function() {
        modal.style.display = "block";
    };

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal

    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    //Adding click actions for "Continue"

    var button = document.getElementById("options1");

    button.onclick = function() {
        $("#search").show();
        $(".modal-content").hide();
        $("#newsResults").hide();
        $("#intro").hide();
        $("#userGreeting").show();


        let personsName = $("#userName").val()
        window.localStorage.setItem("username", personsName)

        console.log("Welcome, " + personsName)

        $("#userGreeting").append("Welcome, " + personsName)
    };

    let url3 =
        "https://newsapi.org/v2/top-headlines?country=us&category=technology&pagesize=3&page=1&apiKey=fa998b4e27f24b81880beb0cb16f85b6";

    $.ajax({
        url: url3,
        method: "GET",
        dataType: "JSON",

        success: function(newsdata) {
            let output = "";
            let newNews = newsdata.articles;

            for (var i in newNews) {
                output += `
        <div class="row">
          <div class="article-news">
              <img src="${newNews[i].urlToImage}"  alt="${newNews[i].title} "height="250px" width="300px">
                <div id= "article-words">Title: <a href="${newNews[i].url}" title="${newNews[i].title}">${newNews[i].title}</a>
                <p><h5><b>Description</b>: ${newNews[i].description}</p><h5>
                <a href="${newNews[i].url}" class="btn-read">Read More</a>
          </div>
        </div>   `;
            }
            $("#newsResults").html(output);
        }, //ends newsdata
    }); //ends ajax
}); // Ends document ready

//---------------NEWS ARTICLES----------------------------------------------

//----------------------JOB SEARCH API AND RESULTS------------------------------

var globalJobs = 0;

//creates the job cards based on the api response
function renderJobCards(
    iCompany,
    iCUrl,
    iUrl,
    iCreated_at,
    iDescription,
    iLocation,
    iTitle
) {
    var cardDiv =
        '<div class="row"><div class="card w-80"><div class="card-header"><a target="_blank" rel="noopener noreferrer" href = "' +
        iCUrl +
        '"class = "card-link"><h3 class="card-title">' +
        iCompany +
        '</h3></a></div><div class="card-body"><h3>' +
        iTitle +
        "</h3><h3>" +
        iLocation +
        '</h3><p class="card-text">' +
        iDescription.substring(0, 500) +
        '</p><form action="' +
        iUrl +
        '" target="_blank"><button type="submit">Read more</button></form></div><div class="card-footer">Created on: ' +
        iCreated_at +
        " </div></div>";
    var breakDiv = '<div class="row"><br/></div>';
    $(".displaycards").append(cardDiv);
    $(".displaycards").append(breakDiv);
}

//function to remove the spaces in the input field
function checkandReplaceSpaces(stringToFormat) {
    stringToFormat = stringToFormat.trim();
    stringToFormat.replace(/\s/g, "+");
    console.log(stringToFormat);
    return stringToFormat;
}

//TBDfunction zipcodeToLocation(stringToCheck) {
// }

//ajax call to the API
function callAPI(skillName, jobLocation, fullTime, offset) {
    // Constructing a URL to search for the job
    var queryURL =
        "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?";

    //TBD get job Locations from zipcodes
    //TBDjoblocation = zipcodeToLocation(joblocation)
    if (jobLocation) {
        jobLocation = checkandReplaceSpaces(jobLocation);
        if (queryURL[queryURL.length - 1] === "?") {
            queryURL = queryURL + "location=" + jobLocation;
        } else {
            queryURL = queryURL + "&location=" + jobLocation;
        }
    }
    if (skillName) {
        if (queryURL[queryURL.length - 1] === "?") {
            queryURL = queryURL + "description=" + skillName;
        } else {
            queryURL = queryURL + "&description=" + skillName;
        }
    }
    var fulltime_bool = false;
    if (fullTime) {
        if (fullTime === "Full Time") {
            fulltime_bool = true;
        }
    }
    if (queryURL[queryURL.length - 1] === "?") {
        queryURL = queryURL + "full_time=" + fulltime_bool;
    } else {
        queryURL = queryURL + "&full_time=" + fulltime_bool;
    }
    queryURL = queryURL + "&page=" + offset;

    //need a try catch block for errors

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        error: function(err) {
            console.log(err);
            //alert("Jobs requested could not be returned");
        },
    }).then(function(response) {
        //return the response

        //initialize to 0
        globalJobs = 0;

        console.log(response);
        requiredArray = response;
        console.log(requiredArray.length);
        //reset divs and the global variables
        $(".displaycards").empty();
        var breakDiv = '<div class="row"><br/></div>';
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
}

//actions to be carried out when the search button is hit
$(document).on("click", "#search-btn", function() {
    console.log("display-jobs-section");
    //get the search parameters
    const searchSkill = $("#searchFormSkill").val().trim();
    const searchLocation = $("#searchFormLocation").val().trim();
    const fullTime = $("#searchFormPosition").children("option:selected").val();

    console.log(searchSkill, searchLocation, fullTime);

    callAPI(searchSkill, searchLocation, fullTime);
});

// ------------------ END OF JOB API CALL ----------------------------

// ------------------ CALL FOR WAGE INFORMATION -------------------
//ajax call to the API
function callWagesAPI(searchLocation, searchPosition) {
    // Constructing a URL to search for the job
    debugger;
    const token =
        "4+0CUzMzAuJK0eSUvLwwqUgrm5Lb2JhAVKGlttonnKTHtxhmnAk1h1FqAOsR1ZY0nVmNTqMh3ZFyEg745ofzuA==";
    var wqueryURL =
        "https://api.careeronestop.org/v1/occupation/YVWz2wiZiFxhjWG/" +
        searchPosition +
        "/" +
        searchLocation +
        "?training=false&interest=true&videos=true&tasks=true&dwas=false&wages=true&alternateOnetTitles=false&projectedEmployment=true&ooh=true&stateLMILinks=true&relatedOnetTitles=true&skills=true&knowledge=true&ability=true&trainingPrograms=true";
    console.log(wqueryURL);

    $.ajax({
        url: wqueryURL,
        method: "GET",
        async: false,
        headers: { Authorization: "Bearer " + token },
        error: function(err) {
            console.log(err);
            //alert("Jobs requested could not be returned");
        },
    }).then(function(response) {
        //return the response
        debugger;
        //reset divs and the global variables
        console.log(response);
        //create the wage data set
        nationalwagelist =
            response["OccupationDetail"][0]["Wages"]["NationalWagesList"];
        console.log(nationalwagelist);
        statewageList = response["OccupationDetail"][0]["Wages"]["StateWagesList"];
        console.log(statewageList);
        wageyear = response["OccupationDetail"][0]["Wages"]["WageYear"];
        console.log(wageyear);
        hourly_dataset = [];
        annual_dataset = [];

        if (nationalwagelist[0]["RateType"] === "Annual") {
            //annual dataset
            if (statewageList[0]["RateType"] === "Annual") {
                annual_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[0]["Pct10"]),
                    "State": parseFloat(statewageList[0]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[0]["Pct25"]),
                    "State": parseFloat(statewageList[0]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[0]["Median"]),
                    "State": parseFloat(statewageList[0]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[0]["Pct75"]),
                    "State": parseFloat(statewageList[0]["Pct75"])
                }];
            } else {
                //use element 1
                annual_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[0]["Pct10"]),
                    "State": parseFloat(statewageList[1]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[0]["Pct25"]),
                    "State": parseFloat(statewageList[1]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[0]["Median"]),
                    "State": parseFloat(statewageList[1]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[0]["Pct75"]),
                    "State": parseFloat(statewageList[1]["Pct75"])
                }];
            }
        } else {
            //Hourly
            if (statewageList[0]["RateType"] === "Hourly") {

                hourly_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[0]["Pct10"]),
                    "State": parseFloat(statewageList[0]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[0]["Pct25"]),
                    "State": parseFloat(statewageList[0]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[0]["Median"]),
                    "State": parseFloat(statewageList[0]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[0]["Pct75"]),
                    "State": parseFloat(statewageList[0]["Pct75"])
                }];
            } else {
                //use element 1
                hourly_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[0]["Pct10"]),
                    "State": parseFloat(statewageList[1]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[0]["Pct25"]),
                    "State": parseFloat(statewageList[1]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[0]["Median"]),
                    "State": parseFloat(statewageList[1]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[0]["Pct75"]),
                    "State": parseFloat(statewageList[1]["Pct75"])
                }];
            }
        }
        //hourly
        if (nationalwagelist[1]["RateType"] === "Annual") {
            //annual dataset
            if (statewageList[0]["RateType"] === "Annual") {
                annual_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[1]["Pct10"]),
                    "State": parseFloat(statewageList[0]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[1]["Pct25"]),
                    "State": parseFloat(statewageList[0]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[1]["Median"]),
                    "State": parseFloat(statewageList[0]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[1]["Pct75"]),
                    "State": parseFloat(statewageList[0]["Pct75"])
                }];
            } else {
                //use element 1            
                annual_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[1]["Pct10"]),
                    "State": parseFloat(statewageList[1]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[1]["Pct25"]),
                    "State": parseFloat(statewageList[1]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[1]["Median"]),
                    "State": parseFloat(statewageList[1]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[1]["Pct75"]),
                    "State": parseFloat(statewageList[1]["Pct75"])
                }];
            }
        } else {
            //hourly
            if (statewageList[0]["RateType"] === "Hourly") {
                hourly_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[1]["Pct10"]),
                    "State": parseFloat(statewageList[0]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[1]["Pct25"]),
                    "State": parseFloat(statewageList[0]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[1]["Median"]),
                    "State": parseFloat(statewageList[0]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[1]["Pct75"]),
                    "State": parseFloat(statewageList[0]["Pct75"])
                }];
            } else {
                //use element 1
                hourly_dataset = [{
                    "model_name": "Pct10",
                    "National": parseFloat(nationalwagelist[1]["Pct10"]),
                    "State": parseFloat(statewageList[1]["Pct10"])
                }, {
                    "model_name": "Pct25",
                    "National": parseFloat(nationalwagelist[1]["Pct25"]),
                    "State": parseFloat(statewageList[1]["Pct25"])
                }, {
                    "model_name": "Median",
                    "National": parseFloat(nationalwagelist[1]["Median"]),
                    "State": parseFloat(statewageList[1]["Median"])
                }, {
                    "model_name": "Pct75",
                    "National": parseFloat(nationalwagelist[1]["Pct75"]),
                    "State": parseFloat(statewageList[1]["Pct75"])
                }];
            }
        }
        console.log("annual_dataset");
        console.log(annual_dataset);
        console.log("hourly_dataset");
        console.log(hourly_dataset);

        //------------charting ----------------------------------------
        if (hourly_dataset.length > 1) {
            var models = hourly_dataset;

            var container = d3.select('#d3id'),
                width = 400,
                height = 300,
                margin = {
                    top: 30,
                    right: 20,
                    bottom: 30,
                    left: 50
                },
                barPadding = .2
            var axisTicks = {
                qty: 5,
                outerSize: 0,
                dateFormat: '%m-%d'
            }

            var svg = container
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
            var xScale1 = d3.scaleBand();
            var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

            var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
            var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

            xScale0.domain(models.map(d => d.model_name));
            xScale1.domain(['National', 'State']).range([0, xScale0.bandwidth()]);
            yScale.domain([0, d3.max(models, d => d.National > d.State ? d.National : d.State)]);

            var model_name = svg.selectAll(".model_name")
                .data(models)
                .enter().append("g")
                .attr("class", "model_name")
                .attr("transform", d => `translate(${xScale0(d.model_name)},0)`);

            /* Add National bars */
            model_name.selectAll(".bar.National")
                .data(d => [d])
                .enter()
                .append("rect")
                .attr("class", "bar National")
                .style("fill", "blue")
                .attr("x", d => xScale1('National'))
                .attr("y", d => yScale(d.National))
                .attr("width", xScale1.bandwidth())
                .attr("height", d => {
                    return height - margin.top - margin.bottom - yScale(d.National)
                });

            /* Add State bars */
            model_name.selectAll(".bar.State")
                .data(d => [d])
                .enter()
                .append("rect")
                .attr("class", "bar State")
                .style("fill", "red")
                .attr("x", d => xScale1('State'))
                .attr("y", d => yScale(d.State))
                .attr("width", xScale1.bandwidth())
                .attr("height", d => {
                    return height - margin.top - margin.bottom - yScale(d.State)
                });

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
        } //check if data is available
    }); //end of function response
}

//actions to be carried out when the search button is hit
$(document).on("click", "#wages-search-btn", function() {
    console.log("display-wageinfo-section");
    //get the search parameters
    const searchLocation = $("#search-region-wage").val().trim();
    const searchPosition = $("#search-position-wage")
        .children("option:selected")
        .attr("value");

    console.log(searchLocation, searchPosition);

    callWagesAPI(searchLocation, searchPosition);
});