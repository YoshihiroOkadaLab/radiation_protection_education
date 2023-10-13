import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
} from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { useControls, folder } from "leva";

// ==========
// Game
import {
    // ----------
    // ui
    DebugPanel,
    // ----------
    // hook
    useToggle,
} from "../../components/game";

// ==========
// Volume
// ----------
// object
import { DoseGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as ENVIROMENT from "../../components/models/Environment";
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    DoseAnimationControls,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../components/volumeRender";

// ==========
// UI
import { SceneConfigPanel } from "../../components/ui";

// ==========
// Store
import { useStore } from "../../components/store";

// ==========
// Styles
import styles from "../../styles/threejs.module.css";

function XRay() {
    const [debug, viewing] = useStore((state) => [state.debug, state.viewing]);

    const ref = useRef<DoseGroup>(null!);

    const timelapseRef = useRef<DoseGroup>(null);
    const nocurtainRef = useRef<DoseAnimationObject>(null);
    const curtainRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const nocurtainAccumuRef = useRef<DoseGroup>(null);
    const curtainAccumuRef = useRef<DoseGroup>(null);

    const curtainObjRef = useRef<THREE.Group>(null);

    const ToggledDebug = useToggle(Debug, "debug");

    const [,] = useControls(() => ({
        scene: folder({
            curtain: {
                value: false,
                onChange: (e) => {
                    nocurtainRef.current
                        ? (nocurtainRef.current.visible = e)
                        : null;
                    curtainRef.current
                        ? (curtainRef.current.visible = !e)
                        : null;

                    nocurtainAccumuRef.current
                        ? (nocurtainAccumuRef.current.visible = e)
                        : null;
                    curtainAccumuRef.current
                        ? (curtainAccumuRef.current.visible = !e)
                        : null;

                    curtainObjRef.current
                        ? (curtainObjRef.current.visible = e)
                        : null;
                },
            },
        }),
    }));

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
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
                        <doseGroup ref={ref}>
                            {/* Time Lapse */}
                            <doseGroup ref={timelapseRef}>
                                {/* X-Ray Dose, no curtain */}
                                <doseAnimationObject
                                    ref={nocurtainRef}
                                    name={"x-ray_animation_nocurtain"}
                                    visible={false}
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
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                </doseAnimationObject>
                                {/* X-Ray Dose, curtain */}
                                <doseAnimationObject
                                    ref={curtainRef}
                                    name={"x-ray_animation_curtain"}
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
                                >
                                    <VOLUMEDATA.XRay_curtain_all_Animation />
                                </doseAnimationObject>
                            </doseGroup>

                            {/* Accumulate */}
                            <doseGroup ref={accumulateRef} visible={false}>
                                {/* X-Ray Dose, no curtain, Accumulate */}
                                <doseGroup
                                    ref={nocurtainAccumuRef}
                                    name={"x-ray_accumulate_nocurtain"}
                                    visible={false}
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
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_accumulate />
                                </doseGroup>
                                {/* X-Ray Dose, curtain, Accumulate */}
                                <doseGroup
                                    ref={curtainAccumuRef}
                                    name={"x-ray_accumulate_curtain"}
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
                                >
                                    <VOLUMEDATA.XRay_curtain_all_accumulate />
                                </doseGroup>
                            </doseGroup>

                            {/* Curtain (Three.js Object) */}
                            <group
                                ref={curtainObjRef}
                                visible={false}
                                position={
                                    ENVIROMENT.XRay_Configure.object3d.position
                                }
                                rotation={
                                    ENVIROMENT.XRay_Configure.object3d.rotation
                                }
                                scale={ENVIROMENT.XRay_Configure.object3d.scale}
                            >
                                <ENVIROMENT.XRay_Curtain />
                            </group>
                        </doseGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <DoseAnimationControls
                            objects={[nocurtainRef, curtainRef]}
                            mainGroup={timelapseRef}
                            subGroup={accumulateRef}
                            duration={16}
                            customSpeed={[8.0, 16.0]}
                        />
                        <VolumeParameterControls object={ref} />
                        <VolumeXYZClippingControls
                            object={ref}
                            folderName="Clip"
                            planeSize={2}
                            subPlaneSize={1}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                ENVIROMENT.XRay_Configure.object3d.position
                            }
                            rotation={
                                ENVIROMENT.XRay_Configure.object3d.rotation
                            }
                            scale={ENVIROMENT.XRay_Configure.object3d.scale}
                        >
                            <ENVIROMENT.XRay_Bed />
                            <ENVIROMENT.XRay_Machine />
                            <ENVIROMENT.XRay_Patient />
                        </group>
                        <mesh position={[0, 1, 0]} visible={debug}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        {/* -------------------------------------------------- */}
                        {/* Physics */}
                        <Physics gravity={[0, -30, 0]}>
                            <ToggledDebug />
                        </Physics>

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
                            renderPriority={1}
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
                    <SceneConfigPanel activateStats={false} />
                </div>
            </div>
        </>
    );
}

export default XRay;
