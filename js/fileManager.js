/**
 * Created by DrTone on 16/05/2017.
 */

class FileManager {
    constructor() {
        this.files = [];
        this.dataLoader = new DataLoader();
    }

    init() {
        return (window.File && window.FileReader && window.FileList && window.Blob);
    }

    loadFile(event, callback) {
        this.files = event.target.files;
        if(this.files.length === 0) {
            alert("No file specified!");
            return;
        }

        let dataFile = this.files[0];
        window.URL = window.URL || window.webkitURL;

        let fileUrl = window.URL.createObjectURL(dataFile);
        this.dataLoader.load(fileUrl, data => {
            if(callback) {
                callback(data);
            }
        });
    }
}