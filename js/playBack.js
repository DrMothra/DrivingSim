/**
 * Created by DrTone on 31/05/2017.
 */

//Playback driving simulator
let fileManager;
function getTime(time) {
    return parseFloat(time);
}

function getPosition(x, y, z) {
    let newX = parseFloat(x);
    let newY = parseFloat(y);
    let newZ = parseFloat(z);

    return new THREE.Vector3(newX, newY, newZ);
}

function getRotation(x, y, z, w) {
    let newX = parseFloat(x);
    let newY = parseFloat(y);
    let newZ = parseFloat(z);
    let newW = parseFloat(w);

    return new THREE.Quaternion(newX, newY, newZ, newW);
}

function getSpeed(speed) {
    return parseFloat(speed);
}

const CLOCKWISE=0, ANTICLOCKWISE=1;

//Extend app from base
class PlayBackApp extends BaseApp {
    constructor() {
        super();
        this.running = false;
        this.simulationTime = 0;
        this.currentIndex = 0;
        this.sceneloaded = false;
        this.fileLoaded = false;
        //Camera views
        this.camViews = [
            new THREE.Vector3(0, 400, -400), //Front
            new THREE.Vector3(0, 400, -1600), //Back
            new THREE.Vector3(-100, 400, -1200), //Left
            new THREE.Vector3(100, 400, -1200) //Right
        ];
        let ROT_INC = Math.PI/128;
        this.tempVec = new THREE.Vector3();
        this.rotQuatClockwise = new THREE.Quaternion();
        this.rotQuatClockwise.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ROT_INC);
        this.rotQuatAntiClockwise = new THREE.Quaternion();
        this.rotQuatAntiClockwise.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -ROT_INC);
    }

    createScene() {
        //Init base createsScene
        super.createScene();

        //Floor plane
        /*
        let texLoader = new THREE.TextureLoader();

        texLoader.load("./textures/fresh.jpg", texture => {
            let planeGeom = new THREE.PlaneBufferGeometry(1500, 1500, 32, 32);
            let planeMat = new THREE.MeshLambertMaterial( {map: texture} );
            let plane = new THREE.Mesh(planeGeom, planeMat);
            plane.rotation.x = -Math.PI/2;
            plane.position.y = -5;
            plane.position.z = -500;
            this.scenes[this.currentScene].add(plane);
        });
        */


        this.jsonLoader = new THREE.JSONLoader();
        this.jsonLoader.load("./models/grassScene.json", (geometry, materials) => {
            let mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            mesh.position.y = -5;
            mesh.position.z = -2500;
            this.scenes[this.currentScene].add(mesh);
        });

        //Simulated car
        /*
        let carGeom = new THREE.BoxBufferGeometry(20, 20, 20);
        let carMat = new THREE.MeshLambertMaterial( {color: 0xff0000} );
        this.car = new THREE.Mesh(carGeom, carMat);
        this.scenes[this.currentScene].add(this.car);
        */
        //Load in model

        this.loader = new THREE.BinaryLoader();
        this.loader.load("./veyron/VeyronNoUv_bin.js", (geometry) => {
            this.car = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( {color: 0x686868} ));
            this.car.scale.set(0.1, 0.1, 0.1);
            this.scenes[this.currentScene].add(this.car);
            this.sceneloaded = true;
        });

    }

    sceneLoaded() {
        return this.sceneloaded;
    }

    initData(time, pos, rot, speed) {
        this.simulationTime = 0;
        this.currentIndex = 0;
        this.maxIndex = time.length;
        this.time = time;
        this.pos = pos;
        this.rot = rot;
        this.speed = speed;
        if(this.sceneloaded) {
            this.car.position.copy(this.pos[this.currentIndex]);
            this.car.quaternion.copy(this.rot[this.currentIndex]);
        }
        this.startTime = this.time[this.currentIndex];
        this.nextTime = (this.time[this.currentIndex+1] - this.startTime)/1000;
        this.fileLoaded = true;
    }

    update() {
        super.update();
        let delta = this.clock.getDelta();
        this.elapsedTime += delta;

        if(this.running && this.sceneloaded) {
            this.simulationTime += delta;
            if(this.simulationTime >= this.nextTime) {
                this.updateSimulation();
            }
        }
    }

    updateSimulation() {
        //DEBUG
        console.log("Simulation updated");

        ++this.currentIndex;
        if(this.currentIndex >= this.maxIndex) {
            this.running = false;
            return;
        }
        this.car.position.copy(this.pos[this.currentIndex]);
        this.car.quaternion.copy(this.rot[this.currentIndex]);
        let overShoot = this.simulationTime - this.nextTime;
        this.nextTime = (this.time[this.currentIndex] - this.time[this.currentIndex-1])/1000;
        this.simulationTime = overShoot/1000;
    }

    changeView(view) {
        //Get view number
        let index = view.match(/\d/g);
        index = index.join("");
        if(isNaN(index)) {
            alert("Invalid map selected!");
            return;
        }
        //Alter cam view
        this.controls.reset();
        this.camera.position.copy(this.camViews[index]);
        this.controls.setLookAt(new THREE.Vector3(0, 0, -1200));
    }

    rotateCam(direction) {
        //Rotate camera around lookat point
        this.tempVec.copy(this.camera.position);
        let vec = this.controls.getLookAt();
        this.tempVec.sub(vec);

        switch(direction) {
            case CLOCKWISE:
                this.tempVec.applyQuaternion(this.rotQuatClockwise);
                break;

            case ANTICLOCKWISE:
                this.tempVec.applyQuaternion(this.rotQuatAntiClockwise);
                break;

            default:
                break;
        }

        this.tempVec.add(this.controls.getLookAt());
        this.camera.position.copy(this.tempVec);
    }

    toggleRunStatus() {
        if(!this.fileLoaded) {
            alert("No simulation file loaded!");
            return;
        }
        this.running = !this.running;
        let elem = $('#playPause');
        elem.attr("src", this.running ? "images/pause-button.png" : "images/play-button.png");
    }

    reset() {
        this.currentIndex = 0;
        this.startTime = this.time[this.currentIndex];
        this.nextTime = (this.time[this.currentIndex+1] - this.startTime)/1000;
        this.simulationTime = 0;
        this.running = false;
        this.car.position.copy(this.pos[this.currentIndex]);
        this.car.quaternion.copy(this.rot[this.currentIndex]);
        let elem = $('#playPause');
        elem.attr("src", "images/play-button.png");
    }
}

$(document).ready( () => {
    fileManager = new FileManager();

    if(!fileManager.init()) {
        alert("File Manager cannot start!");
        return;
    }

    //Make sure we support WebGL
    if ( ! Detector.webgl ) {
        $('#notSupported').show();
        return;
    }

    //Initialise app
    let container = document.getElementById("WebGL-output");
    let app = new PlayBackApp();
    app.init(container);
    //app.createGUI();
    app.createScene();

    let infoToggle = $("#infoToggle");
    $("#simFile").on("change", evt => {
        fileManager.loadFile(evt, data => {
            let newData = data.split("\r\n");
            //Fill in details
            $('#task').html(newData[0].split(/(\\|\/)/g).pop());
            $('#time').html(newData[1]);
            $('#driver').html(newData[2]);
            $('#taskInfo').show();
            infoToggle.show();

            let i, numPoints = newData.length;
            let currentData;
            let time = [], pos = [], rot = [], speed = [];
            const fileOffset = 4;
            for(i=fileOffset; i<numPoints-1; ++i) {
                currentData = newData[i].split(":");
                time.push(getTime(currentData[0]));
                pos.push(getPosition(currentData[1], currentData[2], currentData[3]));
                rot.push(getRotation(currentData[4], currentData[5], currentData[6], currentData[7]));
                speed.push(getSpeed(currentData[8]));
            }
            app.initData(time, pos, rot, speed);
        })
    });

    infoToggle.on("click", () => {
        let infoBox = $('#taskInfo');
        if(infoBox.is(":visible")) {
            infoBox.hide();
            infoToggle.html("Show Info");
        } else {
            infoBox.show();
            infoToggle.html("Hide Info");
        }
    });

    $("[id^='camera']").on("click", function() {
        app.changeView(this.id);
    });

    $("#rotateClock").on("click", () => {
        app.rotateCam(CLOCKWISE);
    });

    $("#rotateAnti").on("click", () => {
        app.rotateCam(ANTICLOCKWISE);
    });

    $('#playPause').on("click", () => {
        app.toggleRunStatus();
    });

    $('#rewind').on("click", () => {
        app.reset();
    });

    app.run();
});
