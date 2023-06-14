import React, { useEffect, useRef } from "react";

import { Canvas, extend } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeGroup, VolumeAnimationObject } from "../../src";
extend({ VolumeGroup });
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";

import * as VOLUMEDATA from "../models/VolumeData";

function XRayRoom() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);
    const refAnimation1 = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
    }, [ref]);

    return (
        <>
            {/* ================================================== */}
            {/* Three.js Canvas */}
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* -------------------------------------------------- */}
                {/* Volume Object */}
                <volumeGroup ref={ref}>
                    {/* Dose */}
                    <volumeAnimationObject
                        ref={refAnimation}
                        position={[45, 0, 48]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                    >
                        <VOLUMEDATA.Dose_all_Animation />
                    </volumeAnimationObject>
                </volumeGroup>

                {/* -------------------------------------------------- */}
                {/* Volume Controls */}
                <VolumeAnimationControls
                    objects={[refAnimation]}
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
                    planeSize={100}
                    subPlaneSize={50}
                />

                {/* -------------------------------------------------- */}
                {/* Three.js Object */}
                <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                    <VOLUMEDATA.Dose_material />
                    <VOLUMEDATA.Dose_region />
                </group>

                {/* -------------------------------------------------- */}
                {/* Three.js Controls */}
                <OrbitControls makeDefault />

                {/* -------------------------------------------------- */}
                {/* Enviroment */}
                <ambientLight intensity={0.5} />

                {/* -------------------------------------------------- */}
                {/* UI */}
                <Stats />

                <GizmoHelper
                    alignment="bottom-right"
                    margin={[80, 80]}
                    renderPriority={-1}
                >
                    <GizmoViewport
                        axisColors={["hotpink", "aquamarine", "#3498DB"]}
                        labelColor="black"
                    />
                </GizmoHelper>
            </Canvas>
        </>
    );
}

export default XRayRoom;
