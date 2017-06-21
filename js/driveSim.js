/**
 * Created by DrTone on 16/05/2017.
 */

let xmlDoc;
let sliderLeft, sliderRight, sliderTop, sliderBottom;
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

function setSliderProperty(xml, container, sliders, elements) {
    xmlDoc = $(xml);
    let i, sliderValue, numSliders = sliders.length;
    for(i=0; i<numSliders; ++i) {
        sliderValue = sliders[i].slider('getValue');
        xmlDoc.find(elements[i]).first().text(sliderValue);
    }
    $('#' + container + "Status").html("Updated");
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
        fileManager.loadFileXML(evt, xmlData => {
            fileInfo.validation = "settings";
            fileInfo.type = "settings";
            if(!fileManager.validateFile(fileInfo)) {
                console.log("Invalid file");
                return;
            }
            showFileEdit(fileInfo);

            //Set options
            let inputAttributes = ["driverName", "showStats", "mirrorMode"];
            let sliderAttributes = ["rearviewMirror"];
            let sliderElems = ["viewPortLeft", "viewPortRight", "viewPortTop", "viewPortBottom"];

            let numElems = inputAttributes.length;
            for(let i=0; i<numElems; ++i) {
                $("#set" + inputAttributes[i]).on("click", () => {
                    if(validateInput(inputAttributes[i])) {
                        setProperty(xmlData, inputAttributes[i]);
                        console.log("Set driver name");
                    }
                });
            }

            //Set up sliders
            let sliders = [];
            let slider, numSliderElems = sliderElems.length;
            for(slider=0; slider<numSliderElems; ++slider) {
                sliders.push($("#" + sliderElems[slider]).slider());
            }

            let numSliders = sliderAttributes.length;
            for(let slider=0; slider<numSliders; ++slider) {
                $("#set" + sliderAttributes[slider]).on("click", () => {
                    setSliderProperty(xmlData, sliderAttributes[slider], sliders, sliderElems);
                })
            }



            $("#saveFile").on("click", () => {
                saveFile(xmlData);
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

