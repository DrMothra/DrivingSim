/**
 * Created by DrTone on 16/05/2017.
 */

function onFileLoaded(data, fileInfo) {
    if(!data) {
        alert("No file data!");
        return;
    }

    //Validate file settings
    let type = fileInfo.type;
    let xmlDoc = $.parseXML(data);
    let contents = $(xmlDoc);
    let status = $('#' + type + 'Status');
    let valid = contents.find(fileInfo.validation).length;
    if(valid) {
        console.log("Valid file");
    } else {
        console.log("Invalid project file");
        status.html("Invalid project file");
        return;
    }

    //Show project name
    let fileName = $('#' + type + 'InputFile').val();
    fileName = fileName.split(/(\\|\/)/g).pop();
    fileName = fileName.substr(0, fileName.length-4);
    status.html("   " + fileName + "   ");
    $('#' + type + 'Edit').show();

    /*
    let bb = window.Blob;
    let filename = "testData.xml";
    saveAs(new bb(
        [data]
        , {type: "text/plain;charset=" + document.characterSet}
        )
        , filename);
        */
}

function editProjectSettings() {
    $('#mainMenu').hide();
    $('#editProjectSettings').show();
}

function editSettings() {
    $('#mainMenu').hide();
    $('#editSettings').show();
}

function hideAllSettings() {
    $('#editProjectSettings').hide();
    $('#editSettings').hide();
}

function backToMainMenu() {
    hideAllSettings();
    $('#mainMenu').show();
}

let fileManager;
$(document).ready( () => {
    fileManager = new FileManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    let fileInfo = {};

    $("#projectFile").on("change", evt => {
        fileManager.loadFile(evt, data => {
            fileInfo.validation = "properties";
            fileInfo.type = "project";
            onFileLoaded(data, fileInfo);
        });
    });

    $("#settingsFile").on("change", evt => {
        fileManager.loadFile(evt, data => {
            fileInfo.validation = "settings";
            fileInfo.type = "settings";
            onFileLoaded(data, fileInfo);
        });
    });

    $("#sceneFile").on("change", evt => {
        fileManager.loadFile(evt, onProjectFileLoaded);
    });

    $("#scenarioFile").on("change", evt => {
        fileManager.loadFile(evt, onProjectFileLoaded);
    });

    $("#interactionFile").on("change", evt => {
        fileManager.loadFile(evt, onProjectFileLoaded);
    });

    //Edit files
    $('#projectEdit').on("click", () => {
        editProjectSettings();
    });

    $('#settingsEdit').on("click", () => {
        editSettings();
    });

    $('.backToMainMenu').on("click", () => {
        backToMainMenu();
    })
});

