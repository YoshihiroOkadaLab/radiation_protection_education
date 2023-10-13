import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { Physics, Debug } from "@react-three/rapier";

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

function CArm() {
    const [debug] = useStore((state) => [state.debug]);

    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const cArmRef = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const cArmAccumuRef = useRef<DoseGroup>(null);

    const ToggledDebug = useToggle(Debug, "debug");

    useEffect(() => {
        console.log(ref.current);
        // console.log(cArmRef);
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
                            <doseGroup
                                ref={timelapseRef}
                                clim2={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .timelapse
                                }
                                clim2AutoUpdate={false}
                            >
                                {/* C-Arm Dose */}
                                <doseAnimationObject
                                    ref={cArmRef}
                                    position={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.volume.scale
                                    }
                                >
                                    <VOLUMEDATA.CArm_all_Animation />
                                </doseAnimationObject>
                            </doseGroup>

                            {/* Accumulate */}
                            <doseGroup
                                ref={accumulateRef}
                                visible={false}
                                clim2={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .accumulate
                                }
                                clim2AutoUpdate={false}
                            >
                                {/* C-Arm Dose, Accumulate */}
                                <doseGroup
                                    ref={cArmAccumuRef}
                                    position={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.volume.scale
                                    }
                                >
                                    <VOLUMEDATA.CArm_all_accumulate />
                                </doseGroup>
                            </doseGroup>
                        </doseGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <DoseAnimationControls
                            objects={[cArmRef]}
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
                                VOLUMEDATA.CArm_Configure.object3d.position
                            }
                            rotation={
                                VOLUMEDATA.CArm_Configure.object3d.rotation
                            }
                            scale={
                                VOLUMEDATA.CArm_Configure.volume.scale *
                                VOLUMEDATA.CArm_Configure.object3d.scale
                            }
                        >
                            <VOLUMEDATA.CArm_material />
                            <VOLUMEDATA.CArm_region />
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

export default CArm;
