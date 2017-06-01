/**
 * Created by DrTone on 16/05/2017.
 */

let xmlDoc;
let sliderLeft, sliderRight, sliderTop, sliderBottom;
function convertToXML(data) {
    if(!data) {
        alert("No file data!");
        return undefined;
    }

    return $.parseXML(data);
}

function validateFile(xml, fileInfo) {
    xmlDoc = $(xml);
    let type = fileInfo.type;
    let status = $('#' + type + 'Status');
    let valid = xmlDoc.find(fileInfo.validation).length;
    if(!valid) {
        console.log("Invalid project file");
        status.html("Invalid project file");
        return false;
    }

    return true;
}

function showFileEdit(fileInfo) {
    //Show project name
    let type = fileInfo.type;
    let fileName = $('#' + type + 'InputFile').val();
    fileName = fileName.split(/(\\|\/)/g).pop();
    fileName = fileName.substr(0, fileName.length-4);
    let status = $('#' + type + 'Status');
    status.html("   " + fileName + "   ");
    $('#' + type + 'Edit').show();
}

function onFileLoaded(data, fileInfo) {
    if(!data) {
        alert("No file data!");
        return;
    }

    //Validate file settings

    let xmlDoc = $.parseXML(data);
    let contents = $(xmlDoc);


    let s = new XMLSerializer();
    let d = xmlDoc;
    let str = s.serializeToString(d);
    console.log(str);



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

function validateInput(element) {
    let input = $("#" + element).val();
    if(!input) {
        alert("Enter value!");
        return false;
    }

    return true;
}

function setProperty(xml, element) {
    xmlDoc = $(xml);
    let value = $('#'+element).val();
    let property = xmlDoc.find(element);
    property.text(value);
    $('#' + element + "Status").html("Updated");
    //DEBUG
    //console.log(property.text());
}

function setMirrorProperty(xml, element) {
    console.log("Slider = ", sliderRight.slider('getValue'));
    xmlDoc = $(xml);
    let left = sliderLeft.slider('getValue');
    let right = sliderRight.slider('getValue');
    let top = sliderTop.slider('getValue');
    let bottom = sliderBottom.slider('getValue');
    xmlDoc.find("viewPortLeft").first().text(left);
    xmlDoc.find("viewPortRight").first().text(right);
    xmlDoc.find("viewPortBottom").first().text(bottom);
    xmlDoc.find("viewPortTop").first().text(top);
    $('#' + element + "Status").html("Updated");
}

function saveFile(xml) {
    let s = new XMLSerializer();
    let serialData = s.serializeToString(xml);

    let bb = window.Blob;
    let filename = "testData.xml";
    saveAs(new bb(
        [serialData]
        , {type: "text/plain;charset=" + document.characterSet}
        )
        , filename);
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
            let xml = convertToXML(data);
            if(!xml) {
                console.log("Invalid file");
                return;
            }
            fileInfo.validation = "settings";
            fileInfo.type = "settings";
            if(!validateFile(xml, fileInfo)) {
                console.log("Invalid file");
                return;
            }
            showFileEdit(fileInfo);
            //Set options
            let inputElems = ["driverName", "showStats", "mirrorMode", "rearviewMirror"];
            $("#set" + inputElems[0]).on("click", () => {
                if(validateInput(inputElems[0])) {
                    setProperty(xml, inputElems[0]);
                    console.log("Set driver name");
                }
            });

            $("#set" + inputElems[1]).on("click", () => {
                if(validateInput(inputElems[1])) {
                    setProperty(xml, inputElems[1]);
                    console.log("Set stats");
                }
            });

            $("#set" + inputElems[2]).on("click", () => {
                if(validateInput(inputElems[2])) {
                    setProperty(xml, inputElems[2]);
                    console.log("Set mirror mode");
                }
            });

            $("#set" + inputElems[3]).on("click", () => {
                setMirrorProperty(xml, inputElems[3]);
                console.log("Set rear view mirror");
            });

            sliderLeft = $("#viewPortLeft").slider();
            sliderRight = $("#viewPortRight").slider();
            sliderTop = $("#viewPortTop").slider();
            sliderBottom = $("#viewPortBottom").slider();

            $("#saveFile").on("click", () => {
                saveFile(xml);
            });
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
    });
});

