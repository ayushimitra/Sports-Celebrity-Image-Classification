Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "http://127.0.0.1:5000/classify_image",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Drop an image",
        autoProcessQueue: false,
        paramName: "file", // Flask expects this key in request.files
    });

    dz.on("addedfile", function () {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("success", function (file, data) {
        console.log(data);
        if (!data || data.length == 0) {
            $("#resultHolder").hide();
            $("#divClassTable").hide();
            $("#error").show();
            return;
        }

        let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];

        let match = null;
        let bestScore = -1;
        for (let i = 0; i < data.length; ++i) {
            let maxScoreForThisClass = Math.max(...data[i].class_probability);
            if (maxScoreForThisClass > bestScore) {
                match = data[i];
                bestScore = maxScoreForThisClass;
            }
        }

        if (match) {
            $("#error").hide();
            $("#resultHolder").show();
            $("#divClassTable").show();
            $("#resultHolder").html($(`[data-player="${match.class}"`).html());
            let classDictionary = match.class_dictionary;
            for (let personName in classDictionary) {
                let index = classDictionary[personName];
                let proabilityScore = match.class_probability[index];
                let elementName = "#score_" + personName;
                $(elementName).html(proabilityScore);
            }
        }
    });

    dz.on("error", function (file, errorMessage) {
        console.error("Upload failed:", errorMessage);
        $("#resultHolder").hide();
        $("#divClassTable").hide();
        $("#error").show();
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();
    });
}

$(document).ready(function () {
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});
