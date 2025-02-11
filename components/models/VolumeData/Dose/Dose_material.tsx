/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
    nodes: {
        mesh0: THREE.Mesh;
    };
    materials: {};
};

import { applyBasePath } from "../../../../utils";
const modelURL = applyBasePath(`/models/gltf/dose_material_1-53.gltf`);

export function Dose_material(props: JSX.IntrinsicElements["group"]) {
    const { nodes, materials } = useGLTF(modelURL) as unknown as GLTFResult;
    return (
        <group {...props} dispose={null}>
            {/* <PerspectiveCamera
                makeDefault={false}
                far={391.9}
                near={326.3}
                fov={30}
                position={[-32.5, 0, -453.59]}
            /> */}
            <mesh
                geometry={nodes.mesh0.geometry}
                material={nodes.mesh0.material}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            >
                <meshBasicMaterial color={0xfafafa} />
            </mesh>
        </group>
    );
}

useGLTF.preload(modelURL);
