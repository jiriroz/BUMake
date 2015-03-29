
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container, stats;

	var camera, scene, renderer;

	init();
	animate();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.z = 600;

		scene = new THREE.Scene();

                var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
                geometry = new THREE.Geometry(),
                floor = -75, step = 25;

                for ( var i = 0; i <= 40; i ++ ) {

                    geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
                    geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

                    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
                    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

                }


                var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
                scene.add( line );

		var light, object;

		scene.add( new THREE.AmbientLight( 0x404040 ) );

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 1, 0 );
		scene.add( light );

		var map = THREE.ImageUtils.loadTexture( 'earth.gif' );
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;
		var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );

		//
		var earth = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 20 ), material );
		earth.position.set( 0, 0, 0 );
		scene.add( earth );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

	}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );
	}


		function animate() {

			requestAnimationFrame( animate );
			render();
	}

		function render() {
			var timer = Date.now() * 0.0001;
			renderer.render( scene, camera );

	}

