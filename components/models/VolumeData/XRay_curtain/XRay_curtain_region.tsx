/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.11 ../../public/models/gltf/x-ray_curtain_region_1002-1019.gltf -t -o ../../components/models/VolumeData/XRay_curtain/XRay_curtain_region.tsx 
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

type ContextType = Record<
    string,
    React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

import { applyBasePath } from "../../../../utils";
const modelURL = applyBasePath(
    `/models/gltf/x-ray_curtain_region_1002-1019.gltf`
);

export function XRay_curtain_region(props: JSX.IntrinsicElements["group"]) {
    const { nodes, materials } = useGLTF(modelURL) as unknown as GLTFResult;

    return (
        <group {...props} dispose={null}>
            {/* <PerspectiveCamera
                makeDefault={false}
                far={906.442}
                near={425.376}
                fov={30}
                position={[-40, -17.5, -726.193]}
            /> */}
            <mesh
                geometry={nodes.mesh0.geometry}
                material={nodes.mesh0.material}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            >
                <meshBasicMaterial color={0xa8a8a8} />
            </mesh>
        </group>
    );
}

useGLTF.preload(modelURL);
