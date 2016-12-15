"use strict"; // needed for the mobile browser


let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links


if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

//Main Intialization Function




function onDeviceReady() {
    console.log("Ready!");

    pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    }

    serverData.getJSON();


}

let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php",
    httpRequest: "GET",
    getJSON: function () {

        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();

        // Add a header(s)
        // key value pairs sent to the server

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");

        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));

        // Now the best way to get this data all together is to use an options object:

        // Create an options object
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };

        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);

        fetch(request)
            .then(function (response) {

                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(data); // now we have JS data, let's display it

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};

function displayData(data) {
    console.log(data);
    //    
    //    localStorage.setItem("Scores", JSON.stringify(data));
    //    var myScoreData = JSON.parse(localStorage.getItem("scores"));
    //    console.log("From LS:");
    //    console.log(myScoreData);


    console.log(data.teams);
    console.log(data.scores);

    //    let scores = data.scores;

    let ul = document.querySelector(".results_lists");
    ul.innerHTML = " "; // clear existing list items

    // create list items for each match in schedule
    data.scores.forEach(function (value) {


        let li = document.createElement("li");
        li.className = "score";

        let h3 = document.createElement("h3");
        h3.textContent = value.date;

        let homeTeam = null;
        let awayTeam = null;

        // add our new schedule HTML to the unordered list
        ul.appendChild(li);
        ul.appendChild(h3);

        value.games.forEach(function (item) {

            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);

            let dg = document.createElement("div");
            let home = document.createElement("div");
            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";

            let away = document.createElement("div");
            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";

            dg.appendChild(home);
            dg.appendChild(away);
            ul.appendChild(dg);
        });

    });

    let teamStandings = [];

    function getTeamName(teams, id) {
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].id == id) {
                return teams[i].name;
            }
        }
        return "unknown";
    }
    data.teams.forEach(function (v) {
        console.log(v.name);
        console.log(v.id);
        teamStandings[v.name] = {
            wins: 0,
            losses: 0,
            ties: 0,
            points: 0,
            name: v.name
        }
    });

    console.log(teamStandings);

    data.scores.forEach(function (score) {
        score.games.forEach(function (game) {
            console.log(game);
            if (game.home_score > game.away_score) {
                //*** Calculating the wins, losse and ties ***//

                //                console.log(getTeamName(data.teams, game.home));

                if (teamStandings[getTeamName(data.teams, game.home)].name == getTeamName(data.teams, game.home)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].wins++;
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].wins);


                }
                if (teamStandings[getTeamName(data.teams, game.away)].name == getTeamName(data.teams, game.away)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].losses++;
                }
            } else if (game.away_score < game.home_score) {

                if (teamStandings[getTeamName(data.teams, game.home)].name == getTeamName(data.teams, game.home)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].losses++;

                }
                if (teamStandings[getTeamName(data.teams, game.away)].name == getTeamName(data.teams, game.away)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].wins++;

                }


            } else {
                if (teamStandings[getTeamName(data.teams, game.home)].name == getTeamName(data.teams, game.home)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].ties++;

                }
                if (teamStandings[getTeamName(data.teams, game.away)].name == getTeamName(data.teams, game.away)) {
                    //                    console.log(teamStandings[getTeamName(data.teams, game.home)].name)
                    teamStandings[getTeamName(data.teams, game.home)].ties++;

                }
            }
        });
    });

    data.teams.forEach(function (element) {
        console.log(element.id);
        let temp = getTeamName(data.teams, element.id);
        teamStandings[temp].points = teamStandings[temp].wins * 2 + teamStandings[temp].ties + teamStandings[temp].losses * (-1);
    });


    data.teams.forEach(function (element) {
        let temp = getTeamName(data.teams, element.id);
        let tbody = document.querySelector("#teamStandings tbody");
        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        tdn.textContent = teamStandings[temp].name;
        let tdw = document.createElement("td");
        tdw.textContent = teamStandings[temp].wins;
        let tdl = document.createElement("td");
        tdl.textContent = teamStandings[temp].losses;
        let tdt = document.createElement("td");
        tdt.textContent = teamStandings[temp].ties;
        let tdp = document.createElement("td");
        tdp.textContent = teamStandings[temp].points;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
    });
};


function navigate(ev) {
    ev.preventDefault();

    let link = ev.currentTarget;
    console.log(link);
    // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
    console.log(id);
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);

    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }
    }
}