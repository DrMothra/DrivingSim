/**
 * Created by DrTone on 16/05/2017.
 */

function onProjectFileLoaded(data) {
    if(!data) {
        alert("No file data!");
        return;
    }

    //Validate file settings
    let xmlDoc = $.parseXML(data);
    let index = data.indexOf("scene.xml");
    if(index >=0) {
        data = data.replace("scene.xml", "tony.xml");
    }
    let contents = $(xmlDoc);
    let status = $('#projectStatus');
    let valid = contents.find("properties").length;
    if(valid) {
        console.log("Valid file");
    } else {
        console.log("Invalid project file");
        status.html("Invalid project file");
        return;
    }

    //Show project name
    let fileName = $('#projectInputFile').val();
    fileName = fileName.split(/(\\|\/)/g).pop();
    fileName = fileName.substr(0, fileName.length-4);
    status.html(fileName);
    $('#editProject').show();

    let bb = window.Blob;
    let filename = "testData.xml";
    saveAs(new bb(
        [data]
        , {type: "text/plain;charset=" + document.characterSet}
        )
        , filename);
}

function onSettingsFileLoaded(data) {
    if(!data) {
        alert("No file data!");
        return;
    }

    //Show project name
    let status = $('#settingsStatus');
    let fileName = $('#settingsInputFile').val();
    fileName = fileName.split(/(\\|\/)/g).pop();
    status.html(fileName);
    $('#editSettings').show();
}

function editProjectSettings() {
    $('#mainMenu').hide();
    $('#editProjectSettings').show();
}

function backToMainMenu() {
    $('#editProjectSettings').hide();
    $('#mainMenu').show();
}

let fileManager;
$(document).ready( () => {
    fileManager = new FileManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    $("#projectFile").on("change", evt => {
        fileManager.loadFile(evt, onProjectFileLoaded);
    });

    $("#settingsFile").on("change", evt => {
        fileManager.loadFile(evt, onSettingsFileLoaded);
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
    $('#editProject').on("click", () => {
        editProjectSettings();
    });

    $('#backToMainMenu').on("click", () => {
        backToMainMenu();
    })
});

