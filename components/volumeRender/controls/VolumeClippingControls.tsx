import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../core";
extend({ VolumeObject, VolumeGroup });
import type { VolumeControlsTypes } from "./types";

type Target = {
    object: THREE.Object3D | undefined;
    id: number;
};

/**
 * Plane Helper Mesh
 */
type planeHelperMeshProps = {
    id: number;
    normal: THREE.Vector3;
    subPlaneSize: number;
    subPlaneColor: THREE.Color;
    visible: boolean;
    onClick: (e: THREE.Event, id: number) => void;
    setMatrix: (matrix: THREE.Matrix4) => void;
};
function PlaneHelperMesh({
    id,
    normal,
    subPlaneSize,
    subPlaneColor,
    visible,
    onClick,
    setMatrix,
}: planeHelperMeshProps) {
    const planeID = id;
    const meshRef = React.useRef<THREE.Mesh>(new THREE.Mesh());
    const [hovered, setHovered] = React.useState(false);
    useCursor(hovered);

    React.useEffect(() => {
        const normal_clone = new THREE.Vector3()
            .copy(normal)
            .multiplyScalar(-1);
        meshRef.current.lookAt(normal_clone);
    }, []);

    return (
        <>
            <mesh
                ref={meshRef}
                name={`plane${id}`}
                scale={subPlaneSize}
                onClick={(e) => {
                    onClick(e, planeID);
                    setMatrix(meshRef.current.matrixWorld);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={visible}
            >
                <planeGeometry />
                <meshBasicMaterial color={subPlaneColor} wireframe={true} />
            </mesh>
        </>
    );
}

/**
 * Controls
 */
type controlsProps = {
    target: Target;
    planes: THREE.Plane[];
};
// PivotControls
type pivotControlsProps = {
    matrix: THREE.Matrix4;
} & controlsProps;
function ClippingPlanesPivotControls({
    target,
    planes,
    matrix,
}: pivotControlsProps) {
    const pivotRef = React.useRef<THREE.Group>(null!);

    function onDrag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        const direction = new THREE.Vector3();
        const position = new THREE.Vector3();
        matrix.copy(w);

        if (target.object) {
            var rotationMatrix = new THREE.Matrix4().extractRotation(w);
            target.object.position.setFromMatrixPosition(w);
            target.object.rotation.setFromRotationMatrix(rotationMatrix);

            position.copy(target.object.position);

            target.object.getWorldDirection(direction);
            direction.normalize().multiplyScalar(-1);

            planes[target.id].normal.copy(direction);
            planes[target.id].constant = -position.dot(direction);
        }
    }

    return (
        <PivotControls
            ref={pivotRef}
            matrix={matrix}
            autoTransform={true}
            onDrag={(l, deltaL, w, deltaW) => {
                onDrag(l, deltaL, w, deltaW);
            }}
        />
    );
}

export type VolumeClippingControlsProps = VolumeControlsTypes & {
    folderName?: string;
    normals?: THREE.Vector3Tuple[];
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeClippingControls = React.forwardRef<
    VolumeClippingControlsProps,
    VolumeClippingControlsProps
>(function VolumeClippingControls(
    {
        children,
        object,
        folderName = "clipping",
        normals = [],
        planeSize = 100,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 50,
        subPlaneColor = new THREE.Color(0xaaaaaa),
        ...props
    },
    ref
) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    // Plane
    const [clipping, setClipping] = React.useState<boolean>(false);
    const [target, setTarget] = React.useState<Target>({
        object: undefined,
        id: 0,
    });
    const Normals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal)
    );
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>(
        Normals.map((n) => new THREE.Plane(n, 0))
    );

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls(() => ({
        [folderName as string]: folder({
            clipping: {
                value: false,
                onChange: (e) => {
                    controls.clipping = e;
                    setClipping(e);
                },
            },
        }),
    }));

    /**
     * Event function
     */
    function onClickPlane(e: THREE.Event, id: number) {
        if (clipping) {
            setTarget({ object: e.object, id: id });
        }
    }

    // Attach volume to controls
    React.useLayoutEffect(() => {
        if (object) {
            if (
                object instanceof VolumeObject ||
                object instanceof VolumeGroup
            ) {
                controls.attach(object);
            } else if (
                object.current instanceof VolumeObject ||
                object.current instanceof VolumeGroup
            ) {
                controls.attach(object.current);
            }
        } else if (group.current instanceof VolumeGroup) {
            controls.attach(group.current);
        }

        return () => void controls.detach();
    }, [object, controls]);

    // Clipping
    React.useEffect(() => {
        controls.clipping = clipping;
        clipping ? (controls.clippingPlanes = Planes) : null;
    }, [controls, clipping, Planes]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />
            <volumeGroup ref={group}>{children}</volumeGroup>
            {/* Controls */}
            <ClippingPlanesPivotControls
                target={target}
                planes={Planes}
                matrix={matrix}
            />
            {/* Clipping Plane */}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping}
                    />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subPlaneSize={subPlaneSize}
                        subPlaneColor={subPlaneColor}
                        visible={clipping}
                        onClick={onClickPlane}
                        setMatrix={setMatrix}
                    />
                </>
            ))}
        </>
    ) : null;
});
