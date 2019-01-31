$(document).ready(function(){
    $(".myButton").button();
    controller.init();
});

var view = {
    init: function(){
        console.log("Initializing view...");
        $("#buttonContinue").click(function(){
            window.location.href = '/';
        });
    }
};

var model = {
    init: function(){
        console.log("Initializing model...");
    }
};

var controller = {
    init: function(){
        console.log("Initializing controller...");
        model.init();
        view.init();
    }
};
        
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 85;
camera.position.y = 30;
camera.position.x = 30;
camera.lookAt(new THREE.Vector3(0,0,0));

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );



var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.x = 60;
directionalLight.position.z = 20;
directionalLight.position.y = 20;

scene.add( directionalLight );

//var light = new THREE.AmbientLight( 0x404040 ); // soft white light
var light = new THREE.AmbientLight( 0xc8c8c8 ); 
scene.add( light );

var extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 5, steps: 5, bevelSize: 0.2, bevelThickness: 1 };

var bladePoints = [
    { x: 10.5, y: 0.75 },
    { x: 5.75, y: 0.75 },
    { x: 5.75, y: 1.75 },
    { x: 10.25, y: 3.5 },
    { x: 10.5, y: 0.75 },
];

var centerGeo = new THREE.CylinderBufferGeometry(1,1,4,32);
var center = new THREE.Mesh(centerGeo, new THREE.MeshLambertMaterial({color:0x9d9d9d}) );
center.rotation.x = Math.PI / 2;
center.position.z = 2;

var group = new THREE.Group();
for (var i = 0; i < 16; i++){
    var angle = Math.PI * 2 / 16 * i;
    console.log("angle: "+angle+", xStart: "+Math.cos(angle)*10.5+", yStart: "+Math.sin(angle) * 0.75);
    var blade = new THREE.Shape();
    blade.moveTo(Math.cos(angle+0.071) * 10.527, Math.sin(angle+0.071) * 10.527);
    blade.lineTo(Math.cos(angle+0.130) * 5.799, Math.sin(angle+0.130) * 5.799);
    blade.lineTo(Math.cos(angle+0.295) * 6.010, Math.sin(angle+0.295) * 6.010);
    blade.lineTo(Math.cos(angle+0.329) * 10.831, Math.sin(angle+0.329) * 10.831);
    blade.lineTo(Math.cos(angle+0.071) * 10.527, Math.sin(angle+0.071) * 10.527);
    var bladeGeo = new THREE.ExtrudeBufferGeometry(blade, extrudeSettings);
    var bladeMesh = new THREE.Mesh(bladeGeo, new THREE.MeshLambertMaterial({color:0x9d9d9d}) );
    group.add(bladeMesh);
}
var blade = new THREE.Shape();
blade.moveTo(10.5, 0.75);
blade.lineTo(5.75, 0.75);
blade.lineTo(5.75, 1.75);
blade.lineTo(10.25, 3.5);
blade.lineTo(10.5, 0.75);
var bladeGeo = new THREE.ExtrudeBufferGeometry(blade, extrudeSettings);
var bladeMesh = new THREE.Mesh(bladeGeo, new THREE.MeshLambertMaterial({color:0x9d9d9d}) );



var outerLogoLeft = new THREE.Shape();
outerLogoLeft.absarc(0,0,11.75,-1.416, 1.416);
outerLogoLeft.lineTo(1.75, 17.5);
outerLogoLeft.lineTo(21.75, 17.5);
outerLogoLeft.lineTo(21.75, -17.5);
outerLogoLeft.lineTo(1.75, -17.5);
var logoLeftGeo = new THREE.ExtrudeBufferGeometry(outerLogoLeft, extrudeSettings);
var logoLeftMesh = new THREE.Mesh(logoLeftGeo, new THREE.MeshPhongMaterial({color:0x5082b3, side: THREE.DoubleSide}) );
scene.add(logoLeftMesh);

var outerLogoRight = new THREE.Shape();
outerLogoRight.absarc(0,0,11.75,1.725, 4.558);
outerLogoRight.lineTo(-1.75, -17.5);
outerLogoRight.lineTo(-21.75, -17.5);
outerLogoRight.lineTo(-21.75, 17.5);
outerLogoRight.lineTo(-1.75, 17.5);
var logoRightGeo = new THREE.ExtrudeBufferGeometry(outerLogoRight, extrudeSettings);
var logoRightMesh = new THREE.Mesh(logoRightGeo, new THREE.MeshPhongMaterial({color:0x003466, side: THREE.DoubleSide}) );
scene.add(logoRightMesh);





group.add(center);
//group.add(logoMesh);
//group.add(bladeMesh);
scene.add(group);

renderer.render(scene, camera);
console.log("working");

var animate = function(){
    requestAnimationFrame(animate);
    group.rotation.z += 0.01;
    renderer.render(scene, camera);
};
animate();