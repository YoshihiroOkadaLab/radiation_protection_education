import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
} from "@react-three/drei";

// ==========
// Volume
// ----------
// object
import { DoseAnimationObject, VolumeGroup } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../../components/volumeRender";

import styles from "../../styles/threejs.module.css";

function XRayMulti() {
    const ref = useRef<VolumeGroup>(null!);
    const refCurtain = useRef<VolumeGroup>(null);
    const refCurtainAnimation = useRef<DoseAnimationObject>(null);
    const refNocurtain = useRef<VolumeGroup>(null);
    const refNocurtainAnimation = useRef<DoseAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas
                        orthographic
                        camera={{ position: [4, 8, 4], zoom: 50 }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}
                        <volumeGroup ref={ref}>
                            {/* Curtain */}
                            <volumeGroup
                                ref={refCurtain}
                                position={[2.5, 0, 0]}
                            >
                                <doseAnimationObject
                                    ref={refCurtainAnimation}
                                    position={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .scale
                                    }
                                    boardCoefficient={0.01}
                                >
                                    <VOLUMEDATA.XRay_curtain_all_Animation />
                                </doseAnimationObject>
                            </volumeGroup>

                            {/* Nocurtain */}
                            <volumeGroup
                                ref={refNocurtain}
                                position={[-2.5, 0, 0]}
                            >
                                <doseAnimationObject
                                    ref={refNocurtainAnimation}
                                    position={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.scale
                                    }
                                    boardCoefficient={0.01}
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                </doseAnimationObject>
                            </volumeGroup>
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeAnimationControls
                            objects={[
                                refCurtainAnimation,
                                refNocurtainAnimation,
                            ]}
                            duration={16}
                        />
                        <VolumeParameterControls object={ref} />
                        <VolumeClippingControls
                            object={ref}
                            folderName="Dose"
                            normals={[
                                [0, 0, -1],
                                // [-1, 0, 0],
                            ]}
                            planeSize={2}
                            subPlaneSize={1}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group position={[2.5, 0, 0]}>
                            <group
                                position={
                                    VOLUMEDATA.XRay_curtain_Configure.object3d
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.XRay_curtain_Configure.object3d
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.XRay_curtain_Configure.volume
                                        .scale *
                                    VOLUMEDATA.XRay_curtain_Configure.object3d
                                        .scale
                                }
                            >
                                <VOLUMEDATA.XRay_curtain_material />
                                <VOLUMEDATA.XRay_curtain_region />
                            </group>
                        </group>
                        <group position={[-2.5, 0, 0]}>
                            <group
                                position={
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .position
                                }
                                rotation={
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .rotation
                                }
                                scale={
                                    VOLUMEDATA.XRay_nocurtain_Configure.volume
                                        .scale *
                                    VOLUMEDATA.XRay_nocurtain_Configure.object3d
                                        .scale
                                }
                            >
                                <VOLUMEDATA.XRay_nocurtain_material />
                                <VOLUMEDATA.XRay_nocurtain_region />
                            </group>
                        </group>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <ambientLight intensity={0.5} />

                        <Grid
                            position={[0, -0.01, 0]}
                            args={[10.5, 10.5]}
                            cellColor={"#121d7d"}
                            sectionColor={"#262640"}
                            fadeDistance={20}
                            followCamera
                            infiniteGrid
                            matrixWorldAutoUpdate={undefined}
                            getObjectsByProperty={undefined}
                            getVertexPosition={undefined}
                        />

                        {/* ================================================== */}
                        {/* UI */}
                        <Stats />

                        <GizmoHelper
                            alignment="bottom-right"
                            margin={[80, 80]}
                            renderPriority={-1}
                        >
                            <GizmoViewport
                                axisColors={[
                                    "hotpink",
                                    "aquamarine",
                                    "#3498DB",
                                ]}
                                labelColor="black"
                            />
                        </GizmoHelper>
                    </Canvas>
                </div>
            </div>
        </>
    );
}

export default XRayMulti;
