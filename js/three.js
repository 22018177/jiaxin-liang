
			import * as THREE from 'three';

			import Stats from 'three/addons/libs/stats.module.js';

			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { Water } from 'three/addons/objects/Water.js';
			import { Sky } from 'three/addons/objects/Sky.js';


			let container, stats;
			let camera, scene, renderer;
			let controls, water, sun, mesh;
 
			init();
			animate();
			function init() {
				container = document.getElementById( 'container' );

				//添加渲染器
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				container.appendChild( renderer.domElement );

				//创建场景对象
				scene = new THREE.Scene();
				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.set( 30, 30, 100 );

				//创建sun3d向量
				sun = new THREE.Vector3();

				// 创建平面几何体(范围为10000)
				const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				water = new Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'img/waternormals.jpg', function ( texture ) {
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
					}
				);

				water.rotation.x = - Math.PI / 2;

				scene.add( water );

				// 设置天空环境
				const sky = new Sky();
				sky.scale.setScalar( 10000 );
				scene.add( sky );

				const skyUniforms = sky.material.uniforms;

				skyUniforms[ 'turbidity' ].value = 10;
				skyUniforms[ 'rayleigh' ].value = 2;
				skyUniforms[ 'mieCoefficient' ].value = 0.005;
				skyUniforms[ 'mieDirectionalG' ].value = 0.8;

				const parameters = {
					elevation: 2,
					azimuth: 180
				};

				const pmremGenerator = new THREE.PMREMGenerator( renderer );
				let renderTarget;
				
				//修改天空
				function updateSun() {
					const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
					const theta = THREE.MathUtils.degToRad( parameters.azimuth );
					sun.setFromSphericalCoords( 1, phi, theta );
					sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
					water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
					if ( renderTarget !== undefined ) renderTarget.dispose();
					renderTarget = pmremGenerator.fromScene( sky );
					scene.environment = renderTarget.texture;
				}

				updateSun();

				//创建一个正方体在水中显示
				const textureLoader = new THREE.TextureLoader();
				// 获取贴图 texture
				const texture = textureLoader.load('img/home.jpg', function () {
					doRender();
				});
				const geometry = new THREE.BoxGeometry( 20, 20, 20 );
				const material = new THREE.MeshStandardMaterial( { roughness: 0 ,map: texture} );
				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				
				controls = new OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = Math.PI * 0.495;
				controls.target.set( 0, 10, 0 );
				controls.minDistance = 40.0;
				controls.maxDistance = 200.0;
				controls.update();

				stats = new Stats();
				

				// 创建窗体控件
				const gui = new GUI();
				const folderSky = gui.addFolder( 'Sky' );
				folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
				folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
				folderSky.open();
				const waterUniforms = water.material.uniforms;
				const folderWater = gui.addFolder( 'Water' );
				folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
				folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
				folderWater.open();
				
				window.addEventListener( 'resize', onWindowResize );
			}

			//设置
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			//动画效果
			function animate() {
				requestAnimationFrame( animate );
				render();
				stats.update();
			}

			 //渲染
			function doRender() {
				// 执行渲染操作-指定场景、相机作为参数
				renderer.render(scene, camera);
			}

			//运动
			function render() {
				const time = performance.now() * 0.001;
				mesh.position.y = Math.sin( time ) * 20 + 5;
				mesh.rotation.x = time * 0.5;
				mesh.rotation.z = time * 0.51;
				water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
				renderer.render( scene, camera );
			}