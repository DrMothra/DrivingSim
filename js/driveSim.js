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
            attributeManager.showEditControls(fileInfo);

            //Set options
            let inputAttributes = ["driverName", "showStats", "mirrorMode"];
            let sliderAttributes = ["rearviewMirror"];
            let sliderElems = ["rear_viewPortLeft", "rear_viewPortRight", "rear_viewPortTop", "rear_viewPortBottom",
                "right_viewPortLeft", "right_viewPortRight", "right_viewPortTop", "right_viewPortBottom",
                "left_viewPortLeft", "left_viewPortRight", "left_viewPortTop", "left_viewPortBottom"];

            let numElems = inputAttributes.length;
            for(let i=0; i<numElems; ++i) {
                $("#set" + inputAttributes[i]).on("click", () => {
                    if(attributeManager.validateInput(inputAttributes[i])) {
                        attributeManager.setProperty(xmlData, inputAttributes[i]);
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
                    attributeManager.setSliderProperty(xmlData, sliderAttributes[slider], sliders, sliderElems);
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

