// ============================================================
// COSMIC BLACK HOLE BACKGROUND
// Three.js r128
// ============================================================

const canvas = document.querySelector("#webgl-canvas");

if (!canvas) {
    console.error("ERROR: #webgl-canvas was not found.");
} else if (typeof THREE === "undefined") {
    console.error("ERROR: Three.js did not load.");
} else {

    // ========================================================
    // SCENE
    // ========================================================

    const scene = new THREE.Scene();


    // ========================================================
    // CAMERA
    // ========================================================

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    camera.position.set(0, 0, 35);


    // ========================================================
    // RENDERER
    // ========================================================

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);


    // ========================================================
    // BLACK HOLE SYSTEM
    // ========================================================

    const blackHoleSystem = new THREE.Group();

    // Put the black hole toward the right side.
    blackHoleSystem.position.set(15, 1, -3);

    // Tilt the whole system slightly.
    blackHoleSystem.rotation.x =
        THREE.MathUtils.degToRad(15);

    blackHoleSystem.rotation.z =
        THREE.MathUtils.degToRad(-8);

    scene.add(blackHoleSystem);


    // ========================================================
    // EVENT HORIZON
    // ========================================================

    const blackHoleGeometry =
        new THREE.SphereGeometry(
            4.5,
            64,
            64
        );

    const blackHoleMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x000000
        });

    const blackHole =
        new THREE.Mesh(
            blackHoleGeometry,
            blackHoleMaterial
        );

    blackHoleSystem.add(blackHole);


    // ========================================================
    // ACCRETION DISK
    // ========================================================

    const diskCount = 14000;

    const diskPositions =
        new Float32Array(diskCount * 3);

    const diskColors =
        new Float32Array(diskCount * 3);


    for (let i = 0; i < diskCount; i++) {

        const i3 = i * 3;

        // Radius
        const radius =
            6.5 + Math.random() * 15;

        // Angle
        const angle =
            Math.random() * Math.PI * 2;

        // Make the disk thicker near the outside
        const thickness =
            (Math.random() - 0.5) *
            (0.3 + radius * 0.035);

        // X/Y plane
        diskPositions[i3] =
            Math.cos(angle) * radius;

        diskPositions[i3 + 1] =
            thickness;

        diskPositions[i3 + 2] =
            Math.sin(angle) * radius;


        // -----------------------------------------------
        // Color gradient
        // -----------------------------------------------

        const heat =
            1 -
            ((radius - 6.5) / 15);

        diskColors[i3] =
            1.0;

        diskColors[i3 + 1] =
            0.12 +
            heat * 0.55;

        diskColors[i3 + 2] =
            0.02 +
            heat * 0.18;
    }


    const diskGeometry =
        new THREE.BufferGeometry();

    diskGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            diskPositions,
            3
        )
    );

    diskGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            diskColors,
            3
        )
    );


    const diskMaterial =
        new THREE.PointsMaterial({

            size: 0.12,

            vertexColors: true,

            transparent: true,

            opacity: 0.95,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const accretionDisk =
        new THREE.Points(
            diskGeometry,
            diskMaterial
        );

    blackHoleSystem.add(
        accretionDisk
    );


    // ========================================================
    // INNER HOT RING
    // ========================================================

    const innerRingGeometry =
        new THREE.RingGeometry(
            5.8,
            7.2,
            128
        );

    const innerRingMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xff5a1f,

            transparent: true,

            opacity: 0.9,

            side: THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const innerRing =
        new THREE.Mesh(
            innerRingGeometry,
            innerRingMaterial
        );

    innerRing.rotation.x =
        Math.PI / 2;

    blackHoleSystem.add(
        innerRing
    );


    // ========================================================
    // OUTER GLOW RING
    // ========================================================

    const outerRingGeometry =
        new THREE.RingGeometry(
            7.5,
            12,
            128
        );

    const outerRingMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x6366ff,

            transparent: true,

            opacity: 0.15,

            side: THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const outerRing =
        new THREE.Mesh(
            outerRingGeometry,
            outerRingMaterial
        );

    outerRing.rotation.x =
        Math.PI / 2;

    blackHoleSystem.add(
        outerRing
    );


    // ========================================================
    // GLOW SPHERE
    // ========================================================

    const glowGeometry =
        new THREE.SphereGeometry(
            8,
            48,
            48
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x4c1d95,

            transparent: true,

            opacity: 0.12,

            side: THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    blackHoleSystem.add(glow);


    // ========================================================
    // STAR FIELD
    // ========================================================

    const starCount = 6000;

    const starPositions =
        new Float32Array(
            starCount * 3
        );

    const starColors =
        new Float32Array(
            starCount * 3
        );


    for (let i = 0; i < starCount; i++) {

        const i3 = i * 3;

        const radius =
            80 +
            Math.random() * 500;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        starPositions[i3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        starPositions[i3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        starPositions[i3 + 2] =
            radius *
            Math.cos(phi);


        const brightness =
            0.5 +
            Math.random() * 0.5;

        starColors[i3] =
            brightness;

        starColors[i3 + 1] =
            brightness;

        starColors[i3 + 2] =
            brightness;
    }


    const starGeometry =
        new THREE.BufferGeometry();

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            starPositions,
            3
        )
    );

    starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            starColors,
            3
        )
    );


    const starMaterial =
        new THREE.PointsMaterial({

            size: 0.15,

            vertexColors: true,

            transparent: true,

            opacity: 0.8,

            depthWrite: false
        });


    const stars =
        new THREE.Points(
            starGeometry,
            starMaterial
        );

    scene.add(stars);


    // ========================================================
    // MOUSE
    // ========================================================

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;


    window.addEventListener(
        "mousemove",
        (event) => {

            targetMouseX =
                event.clientX /
                window.innerWidth -
                0.5;

            targetMouseY =
                event.clientY /
                window.innerHeight -
                0.5;
        }
    );


    // ========================================================
    // RESIZE
    // ========================================================

    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();


            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );


            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            );
        }
    );


    // ========================================================
    // ANIMATION
    // ========================================================

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );

        const elapsed =
            clock.getElapsedTime();


        // -----------------------------------------------
        // Smooth mouse
        // -----------------------------------------------

        mouseX +=
            (
                targetMouseX -
                mouseX
            ) * 0.04;

        mouseY +=
            (
                targetMouseY -
                mouseY
            ) * 0.04;


        // -----------------------------------------------
        // Black hole rotation
        // -----------------------------------------------

        accretionDisk.rotation.z =
            elapsed * 0.45;
            mouseX * 0.15;

        innerRing.rotation.z =
            elapsed * 0.6;
            mouseX * 0.2;

        outerRing.rotation.z =
            -elapsed * 0.15;



        // -----------------------------------------------
        // Glow pulse
        // -----------------------------------------------

        const pulse =
            1 +
            Math.sin(elapsed * 1.5) *
            0.04;

        glow.scale.setScalar(
            pulse
        );


        // -----------------------------------------------
        // Stars
        // -----------------------------------------------

        stars.rotation.y =
            elapsed * 0.008;


        // ========================================================
// BLACK HOLE MOUSE INTERACTION
// ========================================================

// Base rotation
const baseRotationX =
    THREE.MathUtils.degToRad(15);

const baseRotationZ =
    THREE.MathUtils.degToRad(-8);


// Mouse-controlled tilt
const targetRotationY =
    baseRotationX * 0 +
    mouseX * 0.18;

const targetRotationX =
    baseRotationX +
    mouseY * 0.12;


// Smooth rotation
blackHoleSystem.rotation.y =
    THREE.MathUtils.lerp(
        blackHoleSystem.rotation.y,
        targetRotationY,
        0.035
    );

blackHoleSystem.rotation.x =
    THREE.MathUtils.lerp(
        blackHoleSystem.rotation.x,
        targetRotationX,
        0.035
    );


// Keep the slight Z tilt
blackHoleSystem.rotation.z =
    THREE.MathUtils.lerp(
        blackHoleSystem.rotation.z,
        baseRotationZ,
        0.035
    );


        // -----------------------------------------------
        // Camera movement
        // -----------------------------------------------

        camera.position.x +=
            (
                mouseX * 2 -
                camera.position.x
            ) * 0.02;

        camera.position.y +=
            (
                -mouseY * 1.5 -
                camera.position.y
            ) * 0.02;

        camera.lookAt(
            0,
            0,
            0
        );

        // ========================================================
// BLACK HOLE PARALLAX
// ========================================================

const targetBlackHoleX =
    15 + mouseX * 2.5;

const targetBlackHoleY =
    1 - mouseY * 1.5;


blackHoleSystem.position.x =
    THREE.MathUtils.lerp(
        blackHoleSystem.position.x,
        targetBlackHoleX,
        0.025
    );

blackHoleSystem.position.y =
    THREE.MathUtils.lerp(
        blackHoleSystem.position.y,
        targetBlackHoleY,
        0.025
    );


        // -----------------------------------------------
        // Render
        // -----------------------------------------------

        renderer.render(
            scene,
            camera
        );
    }


    // Start
    animate();

    console.log(
        "🌌 Cosmic Black Hole initialized successfully."
    );
}