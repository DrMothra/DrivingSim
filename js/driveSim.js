/**
 * Created by DrTone on 16/05/2017.
 */

function loadNewFile(file) {
    if(!file) {
        alert("No file selected!");
        return;
    }

    window.URL = window.URL || window.webkitURL;

    let fileUrl = window.URL.createObjectURL(file);
    let dataLoader = new DataLoader();
    dataLoader.load(fileUrl, data => {
        //Validate file settings
        //let parser = new DOMParser();
        //let xml = parser.parseFromString(text, 'text/xml');
        let projectInfo = $('#projectInfo');
        let project = $('#project');
        let buttons = $('#projectButtons');
        let xmlDoc = $.parseXML(data);
        let contents = $(xmlDoc);
        let valid = contents.find("properties").length;
        if(valid) {
            console.log("Valid file");
        } else {
            console.log("Invalid project file");
            projectInfo.show();
            project.html("Invalid project file");
            buttons.hide();
            return;
        }

        //Show project name
        buttons.show();
        let fileName = $('#myFile').val();
        fileName = fileName.split(/(\\|\/)/g).pop();
        fileName = fileName.substr(0, fileName.length-4);
        project.html(fileName);
        projectInfo.show();

        //Get all project files
        let projectFiles = contents.find("entry");
        let i, numFiles = projectFiles.length;
        if(numFiles === 0) {
            alert("No project files!");
            return;
        }

        let fileInfo = {};
        let key, xmlFile;
        for(i=0; i<numFiles; ++i) {
            key = $(projectFiles[i]).attr('key');
            xmlFile = $(projectFiles[i]).html();
            fileInfo[key] = xmlFile;
        }

        loadProjectFiles(fileInfo);
    });
}

$(document).ready( () => {
    let fileManager = new FileManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    $("#chooseFile").on("change", evt => {
        loadNewFile(fileManager.onSelectFile(evt));
    });
});

