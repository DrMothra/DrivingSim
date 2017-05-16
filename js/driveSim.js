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
        let test = data;
        let fileName = $('#myFile').val();
        fileName = fileName.split(/(\\|\/)/g).pop();
        fileName = fileName.substr(0, fileName.length-4);
        $('#project').html(fileName);
        $('#projectInfo').show();
    });
}

$(document).ready( () => {
    let fileManager = new FileManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    $("#chooseFile").on("change", function(evt) {
        loadNewFile(fileManager.onSelectFile(evt));
    });
});

