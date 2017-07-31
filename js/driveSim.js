/**
 * Created by DrTone on 16/05/2017.
 */

let xmlDoc;
let sliderLeft, sliderRight, sliderTop, sliderBottom;
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

$(document).ready( () => {
    let fileManager = new FileManager();
    let attributeManager = new AttributeManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    $("#projectFile").on("change", evt => {
        fileManager.loadFile(evt, data => {
            fileInfo.validation = "properties";
            fileInfo.type = "project";
            onFileLoaded(data, fileInfo);
        });
    });

    $("#settingsFile").on("change", evt => {
        fileManager.loadFileXML(evt, xmlData => {
            let fileInfo = {};
            fileInfo.validation = "settings";
            fileInfo.type = "settings";
            if(!fileManager.validateFile(fileInfo)) {
                alert("Invalid settings file!");
                return;
            }
            attributeManager.showEditControls(fileInfo);

            //Set options
            let inputAttributes = ["driverName", "showStats", "mirrorMode"];
            let sliderContainers = ["rearviewMirror", "leftMirror", "rightMirror"];
            let sliderPrefix = ["rear", "left", "right"];
            let sliderElems = ["viewPortLeft", "viewPortRight", "viewPortBottom", "viewPortTop"];

            let numElems = inputAttributes.length;
            //Show existing file settings
            let i;
            for(i=0; i<numElems; ++i) {
                attributeManager.setProperty(xmlData, inputAttributes[i], false);
            }

            for(i=0; i<numElems; ++i) {
                $("#set" + inputAttributes[i]).on("click", () => {
                    if(attributeManager.validateInput(inputAttributes[i])) {
                        attributeManager.saveProperty(xmlData, inputAttributes[i], true);
                    }
                });
            }

            //Set up sliders
            let sliders = [], numSliderContainers = sliderContainers.length;
            for(i=0; i<numSliderContainers; ++i) {
                sliders.push([]);
            }
            let slider, numSliderElems = sliderElems.length, prefix;
            for(i=0; i<numSliderContainers; ++i) {
                prefix = sliderPrefix[i];
                for(slider=0; slider<numSliderElems; ++slider) {
                    sliders[i].push($("#" + prefix + "_" + sliderElems[slider]).slider());
                }
                attributeManager.setSliderProperty(xmlData, sliderContainers[i], sliders[i], sliderElems);
            }

            let numSliders = sliderContainers.length;
            for(let slider=0; slider<numSliders; ++slider) {
                $("#set" + sliderContainers[slider]).on("slideStop", () => {
                    attributeManager.saveSliderProperty(xmlData, sliderContainers[slider], sliders[slider], sliderElems);
                })
            }

            $("#saveFile").on("click", () => {
                fileManager.saveFile();
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

