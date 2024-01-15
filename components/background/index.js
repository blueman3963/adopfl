import { useEffect, useRef, useState } from 'react'
import styles from './background.module.scss'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

const Background = ({launch}) => {
    const initialized = useRef(false)
    const [ intro, setIntro ] = useState(true)
    const wrapper = useRef()

    let user, cursorPos = {x:0.5, y:0.5}, width, height

    useEffect(() => {
        let scene = new THREE.Scene(),
            camera,
            renderer,
            width,
            height,
            textureLoader = new THREE.TextureLoader().setPath('textures/'),
            svgLoader = new SVGLoader().setPath('shapes/'),
            focus = 1,
            radius = 20,
            startAngle = 0.1
            

        const init = async () => {
            //animation control handler
            let progress = 0

            //init three
            renderer = new THREE.WebGLRenderer({antialias: true})
            wrapper.current.appendChild(renderer.domElement)

            camera = new THREE.PerspectiveCamera(120, 0, 0.1, 1000)
            camera.position.y = 0.5
            camera.rotation.y = Math.PI/2
            camera.eulerOrder = 'ZYX'
            const cameraWrapper = new THREE.Group()
            cameraWrapper.rotation.y = startAngle
            cameraWrapper.add(camera)
            scene.add(cameraWrapper)
            camera.position.x = -20

            scene.background = new THREE.Color (0xeeeeee)
            scene.fog = new THREE.Fog( 0xeeeeee, 1, 1.2 )

            const skyTex = textureLoader.load( 'sky.jpg' );
            skyTex.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = skyTex

            //handle resize
            window.addEventListener('resize', onResize)
            onResize()

            //init environment
            const groundGeo = new THREE.CircleGeometry(100,5)
            const groundMat = new THREE.MeshBasicMaterial({color: 0x77aa99, side: THREE.DoubleSide, transparent: true, opacity: 0})
            const ground = new THREE.Mesh(groundGeo, groundMat)
            ground.rotation.x = Math.PI/2
            ground.position.y = -0.1
            scene.add(ground)



            const dome = new THREE.Mesh( new THREE.SphereGeometry(100,5,5),new THREE.MeshBasicMaterial({color: 0xeeeeee, side: THREE.DoubleSide, transparent: true}) )
            scene.add(dome)

            const forest = new THREE.Group
            scene.add(forest)

            const roadGeo = new THREE.PlaneGeometry(40,40)
            const roadTex = textureLoader.load( 'road.png' )
            const roadMat = new THREE.MeshBasicMaterial({map: roadTex, side: THREE.DoubleSide})
            const road = new THREE.Mesh(roadGeo, roadMat)
            road.rotation.x = Math.PI/2
            road.position.y = 0
            //forest.add(road)

            //init light
            const ambLit = new THREE.AmbientLight( 0x404040 )
            scene.add( ambLit )

            const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
            scene.add( directionalLight )

            //init trees
            const loadSVG = async (url) => {
                let treeM = await svgLoader.loadAsync(url).then(data => {

                    let paths = data.paths

                    for ( let i = 0; i < paths.length; i ++ ) {

                        let path = paths[ i ]

                        let shapes = SVGLoader.createShapes( path )

                        for ( let j = 0; j < shapes.length; j ++ ) {

                            let shape = shapes[ j ]

                            let treeGeo = new THREE.ShapeGeometry( shape )
                            treeGeo.applyMatrix( new THREE.Matrix4().makeTranslation( -320, 0, 0 ) );
                            let treeMesh = new THREE.Mesh( treeGeo, new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }))
                            treeMesh.scale.y *= -1

                        }
                    }
                    
                    return treeMesh
                })

                return treeM
            }

            const treeSources = [
                await loadSVG('tree.svg'),
                await loadSVG('tree2.svg'),
                await loadSVG('tree3.svg'),
                await loadSVG('tree4.svg')
            ]
            
            const treeMats = [
                new THREE.MeshBasicMaterial({ color: 0x444477, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x668656, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x578385, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x894567, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x658225, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0xC88C7F, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x8A9C92, side: THREE.DoubleSide, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x9D7157, side: THREE.DoubleSide, transparent: true }),
            ]


            for( let x = 0; x < 2000; x++ ) {
                let treeMesh = treeSources[x%treeSources.length].clone()
                let scale = 0.0015 * (Math.random() + 2)/2
                treeMesh.scale.multiplyScalar( scale )
                treeMesh.position.y = scale * 1000
                let angle = Math.random()*Math.PI*2
                let distance = radius + ( Math.random() * 20 + 2 ) * ( -1 + Math.round(Math.random()) * 2 )
                treeMesh.position.x = distance * Math.sin(angle)
                treeMesh.position.z = distance * Math.cos(angle)
                treeMesh.rotation.y = Math.random()
                treeMesh.material = treeMats[x%treeMats.length]
                forest.add(treeMesh)
            }

            //init user tree
            const userGeos = treeSources.map(s => s.geometry)
            const userGeo = Math.floor(Math.random()*userGeos.length)
            const userMat = [Math.floor(Math.random()*treeMats.length)]

            user = new THREE.Mesh(userGeos[userGeo],treeMats[userMat])
            user.geos = userGeos
            user.geo = userGeo
            user.mats = treeMats
            user.mat = userMat
            user.position.x = - (radius + 1) * Math.cos(startAngle)
            user.position.z = (radius + 1) * Math.sin(startAngle)
            user.scale.multiplyScalar( 0.0015 )
            user.scale.y *= -1 
            user.position.y = 1.5
            user.rotation.y = startAngle+Math.PI/2
            forest.add(user)


            //helper
            const setOpacity = (obj, opacity) => {
                obj.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                      child.material.opacity = opacity
                    }
                })
            }
            //setOpacity(forest, 0)

            //init render
            const speed = 0.002
            const animate = () => {
                if(progress < 1) {
                    if(initialized.current) {
                        progress += 0.002
                        camera.fov = 120 - 60 * progress
                        camera.updateProjectionMatrix()

                        //show
                        scene.fog.far = 1.2 + 25 * progress
                        dome.material.opacity = 1 - progress * 2
                        ground.material.opacity = progress * 2
                    }
                }
                requestAnimationFrame( animate )
                renderer.render(scene, camera)
                cameraWrapper.rotation.y -= speed*focus*Math.max((progress*2-1),0)

                //camera animation
                let cameraP = Math.max(progress - 0.5, 0)/0.5
                camera.rotation.y = - (cursorPos.x - 0.5) * Math.PI * cameraP + Math.PI/2 * (1 - cameraP)
                camera.rotation.x = - (cursorPos.y - 0.5) * Math.PI/8 * cameraP
                focus =  Math.max(1-(Math.abs(cursorPos.x - 0.5)*2),0.1)
            }
            animate()
        }

        const onResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            renderer.setPixelRatio( width/height)
            renderer.setSize( width, height )
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }

        init()
    },[]) 

    const startAfter = (e) => {
        initialized.current = true
        setIntro(false)
        launch(true)

        //init control
        console.log(window.DeviceOrientationEvent, 'ontouchstart' in window)

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
              .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', (e) => {
                        cursorPos.x = - e.gamma*Math.min(Math.max(80 - e.beta,0)/40,1)/360 + 0.5
                        cursorPos.y = - e.beta/90
                    })
                }
              })
              .catch(console.error);
        } else {
            // handle regular non iOS 13+ devices
            if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
                window.addEventListener('deviceorientation', (e) => {
                    cursorPos.x = - e.gamma*(e.beta > 90 ? 1 : -1)/360 + 0.5
                })
            } else {
                width = window.innerWidth
                height = window.innerHeight
                window.addEventListener('mousemove', (e) => {
                    cursorPos.x = e.clientX/width
                    cursorPos.y = e.clientY/height
                })
            }
        }
    }

    const changeShape = () => {
        user.geo ++
        if(user.geo >= user.geos.length) user.geo = 0
        user.geometry = user.geos[user.geo]
    }

    const changeColor = () => {
        user.mat ++
        if(user.mat >= user.mats.length) user.mat = 0
        user.material = user.mats[user.mat]
    }

    return  <>
                <div ref={wrapper} className={styles.wrapper}></div>
                {
                    intro && <>
                        <div className={styles.start} onClick={(e) => startAfter(e)}>Start</div>
                        <div className={styles.color} onClick={(e) => changeColor(e)}>Change Color</div>
                        <div className={styles.shape} onClick={(e) => changeShape(e)}>Change Shape</div>
                    </>
                }
            </>
}

export default Background