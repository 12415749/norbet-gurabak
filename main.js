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
    // Desktop: black hole sits to the right of the content.
    // Tablet: pulled closer to the centre.
    // Mobile (< 768px): centred behind the hero, camera pulled
    // back so the accretion disk is not cut off.
    // ========================================================

    function getLayout() {
        const w = window.innerWidth;

        if (w < 768) {
            return { x: 0, y: 6, z: -6, cameraZ: 68 };
        }

        if (w <= 1024) {
            return { x: 9, y: 2, z: -4, cameraZ: 44 };
        }

        return { x: 15, y: 1, z: -3, cameraZ: 35 };
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
