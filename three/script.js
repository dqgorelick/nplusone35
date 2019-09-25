
const randRange = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, stats, scene, camera, gui, guiData;

var clouds = [];
var cloudsToLoad = ['../cloud0.svg', '../cloud1.svg', '../cloud1.svg', '../cloud4.svg', '../cloud1.svg', '../cloud3.svg']
var colors = [
	0x95CEf0, // light blue 
	0xFFE148, // yellow
	0xDC383E, // red 
	0xF2C2B9, // pink
	0x214596, // blue
	0xFFFFFF, // white
	// 0x292244, // dark blue
];

init();
animate();

var start_time = Date.now();
var globalPos = 0;

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	var container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 30, 200 );
	
	// renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer = new THREE.SVGRenderer();
	// renderer.overdraw(  );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	Promise.all(cloudsToLoad.map(cloud => loadSVG(cloud))).then(loaded => {
		console.log(loaded.length)
		clouds = loaded
		var colorIndex = 0;
		for (var i=0; i<200; i++) {
			// choose and clone random cloud
			var cloud = clouds[randRange(0, cloudsToLoad.length-1)].clone()
			// choose color for cloud
			// var cloudColor = colors[randRange(0, colors.length-1)]
			var cloudColor = colors[colorIndex];

			cloud.children[0].material.color.set(cloudColor)
			colorIndex += 1 
			colorIndex %= (colors.length-1)

			// apply scale and rotation
			var scalar = ((Math.random() + 0.2)) + 0.1; 
			cloud.scale.multiplyScalar( scalar );
			// cloud.scale.x *= Math.random() < 0.5 ? -1 : 1;
			cloud.rotation.z = cloud.rotation.z + ((Math.random() - 0.5) * (Math.PI / 8))

			// find bounds
			var box = new THREE.Box3().setFromObject(cloud)
			var height = box.max.y - box.min.y;
			var width = box.max.x - box.min.x;
			var randY = (Math.random()) * height/4;
			var randX = (Math.random()) * width*2;

			// reposition 
			cloud.position.y = cloud.position.y - box.max.y - randY;
			cloud.position.x = cloud.position.x + randX/2
			cloud.position.z = -i * Math.random() * 30
			scene.add(cloud)
		}
	})
}


function loadSVG( url ) {
	return new Promise((resolve, reject) => {
		var loader = new THREE.SVGLoader();
		loader.load( url, function ( data ) {
			var paths = data.paths;
			var group = new THREE.Group();

			group.width = (data.xml.width.baseVal.value/2)
			group.height = (data.xml.height.baseVal.value)
			group.position.x = -group.width;
			group.position.y = 0;
			group.position.z = 0;
			group.scale.y *= - 1;

			for ( var i = 0; i < paths.length; i ++ ) {
				var path = paths[ i ];
				var fillColor = path.userData.style.fill;
				if ( fillColor !== undefined && fillColor !== 'none' ) {
					var material = new THREE.MeshBasicMaterial( {
						color: new THREE.Color(0xffffff),
						opacity: path.userData.style.fillOpacity,
						transparent: path.userData.style.fillOpacity < 1,
						side: THREE.DoubleSide,
					} );
					var shapes = path.toShapes( true );
					for ( var j = 0; j < shapes.length; j ++ ) {
						var shape = shapes[ j ];
						var geometry = new THREE.ShapeBufferGeometry( shape );
						var mesh = new THREE.Mesh( geometry, material );
						group.add( mesh );
					}
				}
			}
			resolve(group)
		} );
	}); 
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	// reset every 300 clicks
	globalPos = ((Date.now() - start_time ) * 0.03 ) % 300;
	camera.position.z = -globalPos + 100
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

document.addEventListener('click', function() {
	console.log(globalPos);
})
