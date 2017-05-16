/**
 * Created by DrTone on 16/05/2017.
 */

class FileManager {
    constructor() {
        this.files = [];
    }

    init() {
        return (window.File && window.FileReader && window.FileList && window.Blob);
    }

    onSelectFile(event) {
        this.files = event.target.files;
        if(this.files.length === 0) {
            alert("No file specified!");
            return;
        }

        return this.files[0];
    }
}