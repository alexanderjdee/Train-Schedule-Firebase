// Initialize Firebase
var config = {
    apiKey: "AIzaSyBydW8uGtPt09f5TAwo3PFjKPN2keQYIFM",
    authDomain: "train-schedule-f9c2a.firebaseapp.com",
    databaseURL: "https://train-schedule-f9c2a.firebaseio.com",
    projectId: "train-schedule-f9c2a",
    storageBucket: "train-schedule-f9c2a.appspot.com",
    messagingSenderId: "879281563719"
};

firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();

        var trainName = "";
        var destination = "";
        var firstTrainTime = "";
        var frequency = "";

        if ($("#train-name").val().trim() == "") {
            alert("Invalid entry. A name must be entered.");
            document.getElementById("form").reset();
            return;
        }
        else {
            trainName = $("#train-name").val().trim();
        }

        if ($("#destination").val().trim() == "") {
            alert("Invalid entry. A destination must be entered.");
            document.getElementById("form").reset();
            return;
        }
        else {
            destination = $("#destination").val().trim();
        }

        if ($("#first-train-time").val().trim() == "") {
            alert("Invalid entry. The first train time must be entered.");
            document.getElementById("form").reset();
            return;
        }
        else {
            firstTrainTime = $("#first-train-time").val().trim();
        }

        if ($("#frequency").val().trim() == "") {
            alert("Invalid entry. A frequency must be entered.");
            document.getElementById("form").reset();
            return;
        }
        else {
            frequency = $("#frequency").val().trim();
        }

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        document.getElementById("form").reset();
    });

    database.ref().on("child_added", function (snapshot) {
        var firstTrainTime = moment(snapshot.val().firstTrainTime, "HH:mm").subtract(1, "years");
        var currentTime = moment();
        var diffTime = currentTime.diff(moment(firstTrainTime), "minutes");
        var frequency = snapshot.val().frequency;
        var remainder = diffTime % frequency;
        var minutesTillTrain = frequency - remainder;
        var nextArrival = moment().add(minutesTillTrain, "minutes");

        var row = $("<tr>");

        var data1 = $("<td>");
        $(data1).html(snapshot.val().trainName);
        row.append(data1);

        var data2 = $("<td>");
        $(data2).html(snapshot.val().destination);
        row.append(data2);

        var data3 = $("<td>");
        $(data3).html(snapshot.val().frequency);
        row.append(data3);

        var data4 = $("<td>");
        $(data4).html(nextArrival.format("HH:mm"));
        row.append(data4);

        var data5 = $("<td>");
        $(data5).html(minutesTillTrain);
        row.append(data5);

        $("tbody").append(row);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});


