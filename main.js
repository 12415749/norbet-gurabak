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

    // ========================================================
    // RESPONSIVE LAYOUT
    // Desktop: black hole sits to the right, solar system on
    // the upper-left slightly deeper in Z.
    // Tablet: scaled down solar system tucked upper-left.
    // Mobile (< 768px): black hole centred behind hero, solar
    // system scaled down in the lower-left background.
    // ========================================================

    function getLayout() {
        const w = window.innerWidth;

        if (w < 768) {
            return {
                x: 0, y: 6, z: -6, cameraZ: 68,
                solarX: -14, solarY: -18, solarZ: -18, solarScale: 0.55
            };
        }

        if (w <= 1024) {
            return {
                x: 9, y: 2, z: -4, cameraZ: 44,
                solarX: -15, solarY: 9, solarZ: -16, solarScale: 0.75
            };
        }

        return {
            x: 15, y: 1, z: -3, cameraZ: 35,
            solarX: -19, solarY: 7, solarZ: -14, solarScale: 1.0
        };
    }

    let layout = getLayout();

    camera.position.set(0, 0, layout.cameraZ);


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

    // Position depends on screen size (right side on desktop,
    // centred on mobile).
    blackHoleSystem.position.set(layout.x, layout.y, layout.z);

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
    // 3D SOLAR SYSTEM (STATIONARY NEIGHBOURING STAR SYSTEM)
    // ========================================================

    const solarSystem = new THREE.Group();

    solarSystem.position.set(
        layout.solarX,
        layout.solarY,
        layout.solarZ
    );

    solarSystem.scale.setScalar(layout.solarScale);

    // 3D perspective tilt complementing the accretion disk
    const baseSolarRotX = 0.55;
    const baseSolarRotZ = -0.2;

    solarSystem.rotation.x = baseSolarRotX;
    solarSystem.rotation.z = baseSolarRotZ;

    scene.add(solarSystem);

    // Subtle ambient fill + warm solar point light
    const ambientLight = new THREE.AmbientLight(0x4b5563, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffdd66, 2.4, 120);
    solarSystem.add(sunLight);

    // The Sun (core + inner & outer corona glow)
    const sunGeometry = new THREE.SphereGeometry(1.75, 48, 48);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd66
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystem.add(sunMesh);

    const sunCoronaInner = new THREE.Mesh(
        new THREE.SphereGeometry(2.25, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffaa22,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    solarSystem.add(sunCoronaInner);

    const sunCoronaOuter = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xff7711,
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    solarSystem.add(sunCoronaOuter);

    // Planet definitions (Mercury through Neptune)
    const planetConfigs = [
        { name: "Mercury", radius: 3.0, size: 0.2,  color: 0x9c8f84, emissive: 0x26211d, orbitSpeed: 1.55, selfSpeed: 0.9,  phase: 0.4 },
        { name: "Venus",   radius: 4.1, size: 0.32, color: 0xe6a84c, emissive: 0x3b2508, orbitSpeed: 1.15, selfSpeed: 0.65, phase: 1.9 },
        { name: "Earth",   radius: 5.5, size: 0.36, color: 0x2299dd, emissive: 0x082a40, orbitSpeed: 0.9,  selfSpeed: 1.6,  phase: 3.1, hasMoon: true },
        { name: "Mars",    radius: 6.9, size: 0.27, color: 0xd95338, emissive: 0x3a1108, orbitSpeed: 0.72, selfSpeed: 1.4,  phase: 4.7 },
        { name: "Jupiter", radius: 8.8, size: 0.78, color: 0xd99b66, emissive: 0x331f0e, orbitSpeed: 0.43, selfSpeed: 2.1,  phase: 1.1 },
        { name: "Saturn",  radius: 11.2, size: 0.64, color: 0xe3c178, emissive: 0x332810, orbitSpeed: 0.31, selfSpeed: 1.85, phase: 2.6, hasRings: true },
        { name: "Uranus",  radius: 13.4, size: 0.45, color: 0x66d9e8, emissive: 0x0b3138, orbitSpeed: 0.22, selfSpeed: 1.3,  phase: 5.2 },
        { name: "Neptune", radius: 15.3, size: 0.43, color: 0x3b5bdb, emissive: 0x0a1440, orbitSpeed: 0.16, selfSpeed: 1.25, phase: 0.85 }
    ];

    const planets = [];
    let moonPivot = null;

    planetConfigs.forEach((cfg) => {
        // Subtle circular orbit line in the X/Z plane
        const orbitSegments = 128;
        const orbitVertices = [];
        for (let i = 0; i < orbitSegments; i++) {
            const theta = (i / orbitSegments) * Math.PI * 2;
            orbitVertices.push(
                new THREE.Vector3(
                    Math.cos(theta) * cfg.radius,
                    0,
                    Math.sin(theta) * cfg.radius
                )
            );
        }
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitVertices);
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x818cf8,
            transparent: true,
            opacity: 0.15
        });
        const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        solarSystem.add(orbitLine);

        // Planet carrier group + sphere mesh
        const holder = new THREE.Group();
        solarSystem.add(holder);

        const planetGeometry = new THREE.SphereGeometry(cfg.size, 28, 28);
        const planetMaterial = new THREE.MeshStandardMaterial({
            color: cfg.color,
            emissive: cfg.emissive,
            roughness: 0.7,
            metalness: 0.1
        });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        holder.add(planetMesh);

        // Earth's orbiting Moon
        if (cfg.hasMoon) {
            moonPivot = new THREE.Group();
            holder.add(moonPivot);

            const moonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const moonMaterial = new THREE.MeshStandardMaterial({
                color: 0xd1d5db,
                emissive: 0x22262e,
                roughness: 0.85
            });
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
            moonMesh.position.set(0.72, 0.08, 0);
            moonPivot.add(moonMesh);
        }

        // Saturn's tilted planetary ring system
        if (cfg.hasRings) {
            const saturnRingGeometry = new THREE.RingGeometry(
                cfg.size * 1.4,
                cfg.size * 2.35,
                64
            );
            const saturnRingMaterial = new THREE.MeshBasicMaterial({
                color: 0xe8cfa0,
                transparent: true,
                opacity: 0.65,
                side: THREE.DoubleSide
            });
            const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
            saturnRing.rotation.x = Math.PI / 2 - 0.32;
            saturnRing.rotation.y = 0.2;
            holder.add(saturnRing);
        }

        planets.push({
            holder: holder,
            mesh: planetMesh,
            radius: cfg.radius,
            orbitSpeed: cfg.orbitSpeed,
            selfSpeed: cfg.selfSpeed,
            phase: cfg.phase
        });
    });


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

            // Re-evaluate responsive layout
            layout = getLayout();

            camera.position.z = layout.cameraZ;

            blackHoleSystem.position.z = layout.z;

            solarSystem.position.z = layout.solarZ;
            solarSystem.scale.setScalar(layout.solarScale);


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

        accretionDisk.rotation.z = elapsed * 0.45 + mouseX * 0.15;

        innerRing.rotation.z = elapsed * 0.6 + mouseX * 0.2;

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


        // -----------------------------------------------
        // Solar System orbits & axial spins
        // -----------------------------------------------

        sunMesh.rotation.y = elapsed * 0.25;

        const sunPulse = 1 + Math.sin(elapsed * 2.0) * 0.05;
        sunCoronaInner.scale.setScalar(sunPulse);
        sunCoronaOuter.scale.setScalar(1 + Math.cos(elapsed * 1.4) * 0.06);

        for (let i = 0; i < planets.length; i++) {
            const p = planets[i];
            const angle = p.phase + elapsed * p.orbitSpeed;
            p.holder.position.x = Math.cos(angle) * p.radius;
            p.holder.position.z = Math.sin(angle) * p.radius;
            p.mesh.rotation.y = elapsed * p.selfSpeed;
        }

        if (moonPivot) {
            moonPivot.rotation.y = elapsed * 3.4;
        }


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
    layout.x + mouseX * 2.5;

const targetBlackHoleY =
    layout.y - mouseY * 1.5;


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


// ========================================================
// SOLAR SYSTEM MOUSE INTERACTION & PARALLAX
// ========================================================

const targetSolarRotY = mouseX * 0.18;
const targetSolarRotX = baseSolarRotX + mouseY * 0.12;

solarSystem.rotation.y =
    THREE.MathUtils.lerp(
        solarSystem.rotation.y,
        targetSolarRotY,
        0.035
    );

solarSystem.rotation.x =
    THREE.MathUtils.lerp(
        solarSystem.rotation.x,
        targetSolarRotX,
        0.035
    );

solarSystem.rotation.z =
    THREE.MathUtils.lerp(
        solarSystem.rotation.z,
        baseSolarRotZ,
        0.035
    );

const targetSolarX = layout.solarX + mouseX * 2.0;
const targetSolarY = layout.solarY - mouseY * 1.2;

solarSystem.position.x =
    THREE.MathUtils.lerp(
        solarSystem.position.x,
        targetSolarX,
        0.025
    );

solarSystem.position.y =
    THREE.MathUtils.lerp(
        solarSystem.position.y,
        targetSolarY,
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



// ============================================================
// UI ENHANCEMENTS (independent of Three.js)
// - Mobile hamburger menu
// - Scroll-reveal animations
// ============================================================

(function () {

    // --------------------------------------------------------
    // MOBILE MENU TOGGLE
    // --------------------------------------------------------

    const nav = document.querySelector(".top-nav");
    const toggle = document.querySelector(".menu-toggle");

    if (nav && toggle) {

        const setOpen = (open) => {
            nav.classList.toggle("open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? "✕" : "☰";
        };

        toggle.addEventListener("click", () => {
            setOpen(!nav.classList.contains("open"));
        });

        // Close the menu after a link is tapped
        nav.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });

        // Close on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") setOpen(false);
        });

        // Reset when resizing up to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) setOpen(false);
        });
    }


    // --------------------------------------------------------
    // SCROLL REVEAL
    // --------------------------------------------------------

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
        return; // Content simply stays visible
    }

    const targets = document.querySelectorAll(
        ".card, .timeline-item, .project-card"
    );

    targets.forEach((el) => {
        // Small stagger for siblings in the same grid/timeline
        const siblings = el.parentElement
            ? Array.from(el.parentElement.children)
            : [];
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
        el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                el.classList.add("is-visible");
                obs.unobserve(el);

                // Once revealed, drop the helper classes so normal
                // hover transitions are not affected.
                const cleanup = (e) => {
                    if (e.target !== el || e.propertyName !== "opacity") return;
                    el.classList.remove("reveal", "is-visible");
                    el.style.transitionDelay = "";
                    el.removeEventListener("transitionend", cleanup);
                };
                el.addEventListener("transitionend", cleanup);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
})();



// ============================================================
// PHASE 2: PRELOADER, TILT, THEME TOGGLE
// ============================================================

(function () {

    // --------------------------------------------------------
    // PRELOADER
    // --------------------------------------------------------

    const preloader = document.getElementById("preloader");

    function hidePreloader() {
        if (preloader) preloader.classList.add("fade-out");
    }

    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader);
        // Safety net: never trap the user behind the loader if a CDN stalls
        setTimeout(hidePreloader, 8000);
    }


    // --------------------------------------------------------
    // VANILLA TILT (project + certification cards)
    // --------------------------------------------------------

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof VanillaTilt !== "undefined" && !reduceMotion) {
        VanillaTilt.init(document.querySelectorAll(".project-card, .cert-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }


    // --------------------------------------------------------
    // THEME TOGGLE (dark / light, persisted)
    // --------------------------------------------------------

    const themeBtn = document.getElementById("theme-toggle");
    const root = document.documentElement;

    function applyTheme(theme) {
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
        } else {
            root.removeAttribute("data-theme");
        }
        if (themeBtn) {
            // Icon shows what you will switch TO
            themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
            themeBtn.setAttribute(
                "aria-label",
                theme === "light" ? "Switch to dark theme" : "Switch to light theme"
            );
        }
    }

    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }

    applyTheme(saved === "light" ? "light" : "dark");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            applyTheme(next);
            try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
        });
    }
})();
