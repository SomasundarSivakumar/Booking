'use client';
import { useEffect, useRef } from 'react';
import type { Vector3 } from 'three';

export const GlobeThreeJs = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const THREE = await import('three');
            const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

            const container = containerRef.current;
            const canvas = canvasRef.current;
            if (!container || !canvas) return;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);

            const scene = new THREE.Scene();

            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 3);
            camera.position.z = 1.1;

            const controls = new OrbitControls(camera, canvas);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.8;
            controls.minPolarAngle = 0.4 * Math.PI;
            controls.maxPolarAngle = 0.4 * Math.PI;

            // Globe sphere with site theme gradient shader
            const geometry = new THREE.IcosahedronGeometry(1, 22);

            const gradientMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec3 v_normal;
                    void main() {
                        v_normal = normalize(normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 v_normal;
                    vec3 getGradient(float y) {
                        float t = (y + 1.0) / 2.0;
                        // Site theme: steel-blue #4682B4 top, primary #2D3E50 mid, steel-blue bottom
                        vec3 top    = vec3(70.0/255.0,  130.0/255.0, 180.0/255.0);
                        vec3 mid    = vec3(45.0/255.0,  62.0/255.0,  80.0/255.0);
                        vec3 bottom = vec3(70.0/255.0,  130.0/255.0, 180.0/255.0);
                        if (t > 0.6) return mix(mid, top, (t - 0.6) / 0.4);
                        return mix(bottom, mid, t / 0.6);
                    }
                    void main() {
                        vec3 color = getGradient(v_normal.y);
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                side: THREE.DoubleSide,
            });

            const globeMesh = new THREE.Mesh(geometry, gradientMaterial);
            scene.add(globeMesh);

            // Load earth map texture and place white dots on land
            new THREE.TextureLoader().load(
                'https://ksenia-k.com/img/earth-map-colored.png',
                (mask) => {
                    const ctx2d = document.createElement('canvas').getContext('2d');
                    if (!ctx2d) return;
                    const w = mask.image.width;
                    const h = mask.image.height;
                    ctx2d.canvas.width = w;
                    ctx2d.canvas.height = h;
                    ctx2d.drawImage(mask.image, 0, 0);
                    const pixels = ctx2d.getImageData(0, 0, w, h).data;

                    const points = geometry.attributes.position;
                    const count = points.count;
                    const instancePositions: Vector3[] = [];

                    for (let i = 0; i < count; i++) {
                        const u = geometry.attributes.uv.getX(i);
                        const v = geometry.attributes.uv.getY(i);
                        const px = Math.floor(u * w);
                        const py = Math.floor((1 - v) * h);
                        const idx = (py * w + px) * 4;
                        const r = pixels[idx] / 255;
                        if (r > 0.2) {
                            const pos = new THREE.Vector3()
                                .fromBufferAttribute(points, i)
                                .normalize()
                                .multiplyScalar(1.01);
                            instancePositions.push(pos);
                        }
                    }

                    const instanceCount = instancePositions.length;
                    const dotGeo = new THREE.CircleGeometry(0.012, 6);
                    const dotMat = new THREE.MeshBasicMaterial({
                        color: 0xff6b35, // Site theme: dynamic-orange (#FF6B35) for land dots
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.92,
                    });

                    const dotMesh = new THREE.InstancedMesh(dotGeo, dotMat, instanceCount);
                    const dummy = new THREE.Object3D();

                    instancePositions.forEach((pos, i) => {
                        dummy.position.copy(pos);
                        dummy.lookAt(0, 0, 0);
                        dummy.updateMatrix();
                        dotMesh.setMatrixAt(i, dummy.matrix);
                    });

                    dotMesh.instanceMatrix.needsUpdate = true;
                    scene.add(dotMesh);
                }
            );

            // Resize handler
            const resize = () => {
                const width = container.clientWidth;
                const height = container.clientHeight;
                if (!width || !height) return;
                renderer.setSize(width, height);
                const aspect = width / height;
                camera.left = -aspect;
                camera.right = aspect;
                camera.top = 1;
                camera.bottom = -1;
                camera.updateProjectionMatrix();
            };

            let animId: number;
            const animate = () => {
                controls.update();
                renderer.render(scene, camera);
                animId = requestAnimationFrame(animate);
            };

            resize();
            animate();
            window.addEventListener('resize', resize);

            return () => {
                cancelAnimationFrame(animId);
                window.removeEventListener('resize', resize);
                renderer.dispose();
                controls.dispose();
                geometry.dispose();
                gradientMaterial.dispose();
            };
        };

        init().then(fn => { cleanup = fn; });

        return () => { cleanup?.(); };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[620px] lg:h-[620px] lg:left-auto lg:right-[-4%] xl:right-[4%] lg:translate-x-0 opacity-20 lg:opacity-85 transition-all duration-300 pointer-events-none lg:pointer-events-auto"
        >
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};
