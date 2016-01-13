
var getRandomLottoNumbers = function (powerball) {
    var n = [];
    var range = powerball ? 26 : 69;
    for (var i = 1; i < range+1; i++) {
        n.push(i);
    }

    if(powerball) {
        while (n.length > 1) {
            n.splice(Math.floor(Math.random() * n.length), 1);
        }
        return n[0];
    } else {
        while (n.length > 5) {
            n.splice(Math.floor(Math.random() * n.length), 1);
        }
        return n;
    }
};

var newArray = function (size) {
    var tempArray = [];
    for(var i=1; i < size+1; i++) {
        tempArray[i] = 0;
    }
    return tempArray;
};

var cleanup = function(fullCleanup) {
    $("#results").empty();
    $("#finish-time").empty();
    if(fullCleanup) {
        $("#times-to-run").val("5000");
    }
};

var findTheMagicNumbers = function() {
    var start = new Date().getTime();
    var results = $('#results');
    cleanup(false);
    var timesToRun = $("#times-to-run").val();
    var allNumbers = newArray(69);
    var pbNumbers = newArray(26);

    //retrieve random lotto combinations
    var combinations = [];
    for(var i=0; i < timesToRun; i++) {
        combinations[i] = getRandomLottoNumbers(false);
    }
    var powerBalls = [];
    for(var i=0; i < timesToRun; i++) {
        powerBalls[i] = getRandomLottoNumbers(true);
    }
    //count numbers
    for(var i = 0; i < combinations.length; i++){
        var combination = combinations[i];
        for(var j=0; j < combination.length; j++){
            allNumbers[combination[j]]++;
        }
    }
    for(var i=0; i < powerBalls.length; i++){
        pbNumbers[powerBalls[i]]++;
    }
    var top5 = [1,2,3,4,5];
    var powerBall = 1;

    //find winning top 5
    for (var i=0; i<top5.length; i++) {
        var thisPick = top5[i];
        for (var j = 1; j < allNumbers.length; j++) {
            var challenger = allNumbers[j];
            var defender = allNumbers[thisPick];

            //console.log("Challenger["+j+":"+challenger+"] > defender["+thisPick+":"+defender+"] == "+(challenger > defender)+" && top5.indexOf("+j+") == -1) == "+(top5.indexOf(j)));
            if (challenger > defender && (top5.indexOf(j) == -1)) {
                //update top5 position
                thisPick = j;
                defender = allNumbers[thisPick];
                top5[i] = thisPick;
            }
        }
    }

    //find winning powerball
    for(var i=1; i < pbNumbers.length; i++){
        if(pbNumbers[i] > pbNumbers[powerBall]){
            powerBall = i;
        }
    }
    results.prepend("<div class=\"top5 row\"></div><div class=\"powerball row\">"+powerBall+"</div>");
    for(var i=0; i<top5.length; i++) {
        $("#results .top5").append("<div class=\"ball\">"+top5[i]+"</div>");
    }
    results.removeClass("dn");
    var end = new Date().getTime();
    var timestamp = end - start;
    $("#finish-time").append("time: " + timestamp + "ms");

};

$(document).on('pageinit', function(){
    $('div.ui-loader').empty();
    $('#times-to-run').on('submit', function(e){
        e.preventDefault();
        findTheMagicNumbers();
    });
    $('#run').on('vclick', function(e){
        e.preventDefault();
        findTheMagicNumbers();
    });
    $("#clear").on("vclick", function(e) {
        e.preventDefault();
        cleanup(true);
    });
});

