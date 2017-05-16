/**
 * Created by DrTone on 16/05/2017.
 */

function loadNewFile(file) {

}

$(document).ready( () => {
    $("#chooseFile").on("change", function(evt) {
        loadNewFile(fileManager.onSelectFile(evt));
    });
});

