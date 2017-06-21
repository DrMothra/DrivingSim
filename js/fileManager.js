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

    loadFileXML(event, callback) {
        this.files = event.target.files;
        if(this.files.length === 0) {
            alert("No file specified!");
            return;
        }

        let dataFile = this.files[0];
        window.URL = window.URL || window.webkitURL;

        let fileUrl = window.URL.createObjectURL(dataFile);
        this.dataLoader.load(fileUrl, data => {
            this.xmlFile = $.parseXML(data);
            if(callback) {
                callback(this.xmlFile);
            }
        })
    }

    validateFile(fileInfo) {
        if(!this.xmlFile) {
            console.log("No XML file!");
            return false;
        }

        let xmlDoc = $(this.xmlFile);
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
}