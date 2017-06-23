/**
 * Created by atg on 21/06/2017.
 */

class AttributeManager {
    constructor() {

    }

    showEditControls(fileInfo) {
        //Show project name
        let type = fileInfo.type;
        let fileName = $('#' + type + 'InputFile').val();
        fileName = fileName.split(/(\\|\/)/g).pop();
        fileName = fileName.substr(0, fileName.length-4);
        let status = $('#' + type + 'Status');
        status.html("   " + fileName + "   ");
        $('#' + type + 'Edit').show();
    }

    validateInput(attribute) {
        let input = $("#" + attribute).val();
        if(!input) {
            alert("Enter value!");
            return false;
        }

        return true;
    }

    setProperty(xmlData, attribute) {
        let xmlDoc = $(xmlData);
        let value = $('#'+attribute).val();
        let property = xmlDoc.find(attribute);
        property.text(value);
        $('#' + attribute + "Status").html("Updated");
    }

    setSliderProperty(xmlData, container, sliders, sliderElements) {
        let xmlDoc = $(xmlData);
        let containerElem = xmlDoc.find(container);
        if(!containerElem) {
            console.log("No container elem!");
            return;
        }
        let i, sliderValue, numSliders = sliders.length;
        for(i=0; i<numSliders; ++i) {
            sliderValue = sliders[i].slider('getValue');
            containerElem.find(sliderElements[i]).first().text(sliderValue);
        }
        $('#' + container + "Status").html("Updated");
    }
}