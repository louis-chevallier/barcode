
import * as THREE from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
//import { MTLLoader } from './js/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container;

let camera, renderer, cameraControls;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let object;

var scene = new THREE.Scene();
container = document.createElement( 'div' );
document.body.appendChild( container );


const video = document.querySelector('video');
/*
const canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;
const button = document.querySelector('button');

button.onclick = function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
};

navigator.mediaDevices.getUserMedia( {audio: false, video: true })
.then(stream => video.srcObject = stream)
.catch(error => console.error(error); 
*/

function date() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    return dateTime
}    


function reinitscene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250*2*2;
    //camera.position.y = 1000;
    // scene

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    //controls = new OrbitControls(camera);
    //controls.addEventListener('change', renderer);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.addEventListener( 'change', render );
    
}

function init(scene) {
    renderer = new THREE.WebGLRenderer();    
    reinitscene()
    //scene = new THREE.Scene();
    
    // manager

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove );
    window.addEventListener( 'resize', onWindowResize );
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.addEventListener( 'change', render );
    
}

function loadModel() {
    console.log( 'load model')
    object.traverse( function ( child ) {
	if ( child.isMesh ) {
            /*
            child.material.map = textureDiffuse;
            child.material.metalnessMap = textureCombined;
            child.material.aomap = textureCombined;
            child.material.roughnessMap = textureCombined;
            child.material.normalMap = textureNormal;
            child.material.needsUpdate = true;
            child.material.roughness = 1.
            */
            
        }
    } );
    object.position.y = - 95;
    scene.add( object );
}

//const manager = new THREE.LoadingManager( loadModel );
// texture
//const textureLoader = new THREE.TextureLoader( manager );

//const texture = textureLoader.load( 'textures/uv_grid_opengl.jpg' );
//const texture = textureLoader.load( 'models/results.png');
// model

function onProgress( xhr ) {
    if ( xhr.lengthComputable ) {
	const percentComplete = xhr.loaded / xhr.total * 100;
	console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function onError() {
    console.log( 'error '); 
}

//const loader = new OBJLoader( manager );

let modell = 'models/obj/male02/male02.obj';
modell = 'models/result.obj';
//modell = 'models/result1.obj';
//modell = 'models/male02.obj';

/*
loader.load(modell, function ( obj ) {
    console.log( 'model ' + modell);
    object = obj;
}, onProgress, onError );
*/


window.doload = function(mtl, obj, scaleFactor) {
    //initScene();
    console.log("a " + obj);
    for( var i = scene.children.length - 1; i >= 0; i--) {
        console.log("remove " + i);
        let obj1 = scene.children[i];
        scene.remove(obj1); 
    }
    reinitscene()
    console.log("b");
    new MTLLoader()
        .setPath( './' )
        .load( mtl, function ( materials ) {
            console.log("d");                                
	    materials.preload();
            console.log(obj);                                
            console.log(mtl);                                
	    new OBJLoader()
	        .setMaterials( materials )
	        .setPath( './' )
	        .load( obj, function ( object ) {
                    console.log("c");                    
                    //object.computeVertexNormals(true);                
                    object.scale.set(scaleFactor, scaleFactor, scaleFactor);
                    object.rotateY(THREE.MathUtils.degToRad(-40));                
		    //object.position.y = - 95;
                    //materials.shading = THREE.SmoothShading;
                    object.traverse( function( child ) {
                        console.log(child);
                        /*
                          if ( child instanceof THREE.Mesh ) {
                          child.material = material;
                          }*/
                        if ( child instanceof THREE.Object3D ) {
                            console.log("xx");                            
                            if(child.geometry !== undefined){
                                console.log("yy");                                
              	                child.geometry.deleteAttribute( 'normal' );
                                child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
                                child.geometry.computeVertexNormals();
                            }
                        }
                        if (child.material) {
                            /*
                            child.material.map = textureDiffuse;
                            child.material.metalnessMap = textureCombined;
                            child.material.aomap = textureCombined;
                            child.material.roughnessMap = textureCombined;
                            child.material.normalMap = textureNormal;
                            child.material.needsUpdate = true;
                            */
                        }

                        
                    } );
                    console.log("adding")
		    scene.add( object );
                    
	        }, onProgress );
            
        } );
}


function buttonX() {
    console.log("button");
    doload('result.mtl', 'result.obj', 4);    
}
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - mouseY - camera.position.y ) * .05;
    //camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function trace(txt) {
    let t = document.getElementById("json").innerHTML;    
    if (txt == "clear") {
        t = "";
    }
    if (t.length > 2000) {
        t = t.slice(0, 2000);
    }
    document.getElementById("json").innerHTML  =  date() + txt + "<br>" + t;        
}

function doGo() {
    let murl = "/runOnPhoto";
    //console.log("fetching");
    fetch(murl).then(function(response) {
        console.log("response");
        let d = response.json();
        console.log(d);
        return d;
    }).then(function(data) {
        trace(" /runOnPhoto response=" + JSON.stringify(data))
    })
}

function doReset() {
    let murl = "/resetImageCounter";
    fetch(murl).then(function(response) {
        console.log("reponse doreset");
        console.log(response);
        let d = response.json();
        console.log(d);
        document.getElementById("message").innerHTML = d;
        
        return d;
    }).then(function(data) {
        console.log(data);
        trace(" /doReset response=" + JSON.stringify(data))
        
    })
}

function statut() {
    let murl = "/progress";
    //console.log("fetching progress");
    fetch(murl).then(function(response) {
        //console.log("reponse");
        //console.log(response);
        let d = response.json();
        //console.log(d);
        return d;
    }).then(function(data) {
        //console.log(data);
        //button.innerHTML = count;
        if (data["computation_just_finished"] !== undefined) {
            let radic = data["objpath"]
            console.log("loading result obj");
            console.log(radic);
            doload(radic + '.mtl', radic + '.obj', 4);
            fileselect = document.getElementById("fileselect")
            fileselect.disabled = false
            fileselect = document.getElementById("photoselect")            
            photoselect.disabled = false;
            trace("clear");
            /*
            loader.load(modell, function ( obj ) {
                console.log( 'model ' + modell);
                object = obj;
            }, onProgress, onError );
            */
        }
        fileselect.disabled = data["running"]
        document.getElementById("progress").innerHTML = "progress : " + data["progress"] + "%";
        document.getElementById("message").innerHTML = data["message"];
        trace(" /progress response=" + JSON.stringify(data))
        setTimeout(statut, 1000);
    }).catch(function(ee) {
        console.log(ee);
        console.log("Booo");
    });
}

const myTimeout = setTimeout(statut, 1000);

function activate(b)
{
    console.log('b', b);
    const req1 = new XMLHttpRequest();
    req1.open("POST", "/config", true);
    req1.setRequestHeader('X-active', b);
    console.log('sending', b);
    req1.send();
    trace(" /config active= " + b)

}

function upload(file)
{

    const fquality  = document.getElementById("quality")
    const req1 = new XMLHttpRequest();
    req1.open("POST", "/config", true);
    req1.setRequestHeader('X-quality', fquality.value);    
    console.log('sending', fquality.value);
    req1.send();
    
    var xhr = new XMLHttpRequest();
    console.log("uploading file");
    var fileselect = document.getElementById("fileselect")
    fileselect.disabled = true
    console.log('upload ..');
    xhr.upload.addEventListener('progress', function(event) 
                                {
                                    console.log('progress uploading', file.name, event.loaded, event.total);
                                });
    xhr.addEventListener('readystatechange', function(event) 
                         {
                             console.log(
                                 'ready state', 
                                 file.name, 
                                 xhr.readyState, 
                                 xhr.readyState == 4 && xhr.status
                             );
                         });
    console.log("posting ...")
    xhr.open('POST', '/upload', true);
    xhr.setRequestHeader('X_Filename', file.name);    
    console.log('sending', file.name, file);
    xhr.send(file);
}

function uploadPhoto(file)
{
    
    var xhr = new XMLHttpRequest();
    console.log("uploading photo");
    var photoselect = document.getElementById("photoselect")
    photoselect.disabled = true
    console.log('uploading photo ..');


    let formData = new FormData(); // creates an object, optionally fill from <form>
    formData.append("ufile", file.name); // appends a field
    
    xhr.upload.addEventListener('progress', function(event) 
                                {
                                    console.log('progress uploading', file.name, event.loaded, event.total);
                                });
    xhr.addEventListener('readystatechange', function(event) 
                         {
                             console.log(
                                 'ready state', 
                                 file.name, 
                                 xhr.readyState, 
                                 xhr.readyState == 4 && xhr.status
                             );
                             photoselect.disabled = false                             
                         });
    console.log("posting ...")
    xhr.open('POST', '/uploadPhoto', true);
    xhr.setRequestHeader('X_Filename', file.name);
    xhr.setRequestHeader("Content-Type", "multipart/form-data")
    xhr.send(formData)    
    console.log('sending', file.name, file);
    //xhr.send(file)
    trace(" /uploadPhoto filename=" + file.name)
    
}

var select = document.getElementById('fileselect');
console.log('select', select);
var form   = document.getElementById('upload')
select.addEventListener('change', function(event)
                        {
                            console.log('change');
                            for(var i = 0; i < event.target.files.length; i += 1)
                            {
                                console.log('upload');
                                upload(event.target.files[i]);
                                console.log('upload done');                                
                            }
                            form.reset();
                        });

var selectPhoto = document.getElementById('photoselect');
console.log('select', select);
var formPhoto   = document.getElementById('uploadPhoto')
selectPhoto.addEventListener('change', function(event)
                             {
                                 console.log('change');
                                 for(var i = 0; i < event.target.files.length; i += 1)
                                 {
                                     console.log('upload');
                                     uploadPhoto(event.target.files[i]);
                                     console.log('upload done');                                
                                 }
                                 formPhoto.reset();
                             });

console.log('init');
init(scene);
//doload('male02.mtl', 'male02.obj', 1);
doload('result.mtl', 'result.obj', 4);

console.log('animate');
animate();


// trick pour rendre ces fct accessibles depuis le html ..
window.doReset = doReset;
window.doGo = doGo;
window.activate = activate;

