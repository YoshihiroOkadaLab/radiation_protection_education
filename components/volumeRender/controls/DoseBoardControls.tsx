import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeBase,
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../../../src";
extend({ VolumeObject, VolumeGroup });

export type DoseBoardControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object1: React.RefObject<VolumeObject> | React.RefObject<VolumeGroup>;
    object2: React.RefObject<VolumeObject> | React.RefObject<VolumeGroup>;
    origin: THREE.Vector3 | THREE.Object3D;
    width?: number;
    height?: number;
    folderName?: string;
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const DoseBoardControls = React.forwardRef<
    DoseBoardControlsProps,
    DoseBoardControlsProps
>(function DoseBoardControls(
    {
        children,
        object1,
        object2,
        origin,
        width = 1,
        height = 1,
        folderName = "board",
        planeSize = 2,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 1,
        ...props
    },
    ref
) {
    const controls1 = React.useMemo(() => new VolumeControlsImpl(), []);
    const controls2 = React.useMemo(() => new VolumeControlsImpl(), []);

    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    const pivotRef = React.useRef<THREE.Group>(null!);
    const boardRef = React.useRef<THREE.Group>(null!);
    const helperRef = React.useRef<THREE.Group>(null!);

    const [visible, setVisible] = React.useState<boolean>(true);

    // -----
    // Plane
    // -----
    const [clipping, setClipping] = React.useState<boolean>(false);
    const [Origin, setOrigin] = React.useState<THREE.Vector3>(
        origin instanceof THREE.Object3D ? origin.position : origin
    );
    // Planes = [Board, Board_top, Board_right, Board_bottom, Board_left]
    const table = [
        { name: "board", index: 0, cross: 0 },
        { name: "top", index: 1, cross: 2 },
        { name: "right", index: 2, cross: 3 },
        { name: "bottom", index: 3, cross: 4 },
        { name: "left", index: 4, cross: 1 },
    ];
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>(
        new Array(5).fill(new THREE.Plane()).map(() => {
            return new THREE.Plane();
        })
    );
    const [Normals, setNormals] = React.useState<THREE.Vector3[]>(
        new Array(5).fill(new THREE.Vector3()).map(() => {
            return new THREE.Vector3();
        })
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
                    setClipping(e);
                },
            },
            visible: {
                value: true,
                onChange: (e) => {
                    setVisible(e);
                },
            },
        }),
    }));

    /**
     *
     */
    function onDrag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        const boardDirection = new THREE.Vector3();

        const A = new THREE.Vector3();
        const B = new THREE.Vector3();
        let Positions = new Array<THREE.Vector3>();

        // matrix.copy(w);

        if (boardRef.current) {
            var rotationMatrix = new THREE.Matrix4().extractRotation(w);
            boardRef.current.position.setFromMatrixPosition(w);
            boardRef.current.rotation.setFromRotationMatrix(rotationMatrix);

            boardRef.current.getWorldDirection(boardDirection);
        }

        if (helperRef.current) {
            // Record world positions of Board main, top, right, bottom, left
            Positions = table.map((value, index) => {
                let tmpObject = helperRef.current.getObjectByName(value.name);
                let tmpVector3 = new THREE.Vector3();

                return tmpObject
                    ? tmpVector3.setFromMatrixPosition(tmpObject.matrixWorld)
                    : tmpVector3;
            });

            // Calc each plane normal
            for (let i = 0; i < table.length; i++) {
                let tmp = table[i];

                // Calc Normal
                if (tmp.name === "board") {
                    A.subVectors(Positions[4], Positions[0]); // A = P_left - P_board
                    B.subVectors(Positions[1], Positions[0]); // B = P_top - P_board
                } else {
                    A.subVectors(Positions[tmp.index], Origin); // A = P_i - Origin
                    B.subVectors(Positions[tmp.cross], Positions[0]); // B = P_i_cross - P_board
                }
                Normals[tmp.index].crossVectors(A, B); // A x B
                Normals[tmp.index].normalize();

                // check direction
                A.subVectors(Positions[0], Origin); // A = P_board - Origin
                B.copy(boardDirection);
                if (A.dot(B) < 0) {
                    Normals[tmp.index].multiplyScalar(-1);
                }

                // Set Plane's normal and constant
                Planes[tmp.index].normal.copy(Normals[tmp.index]);
                Planes[tmp.index].constant = -Positions[tmp.index].dot(
                    Normals[tmp.index]
                );

                // Set direction from Normal
                let tmpTargetPosition = Positions[tmp.index].clone();
                tmpTargetPosition.add(Normals[tmp.index]);
                let tmpObject = helperRef.current.getObjectByName(tmp.name);
                tmpObject?.lookAt(tmpTargetPosition);
            }
        }
    }

    /**
     *
     */
    // Attach volume to controls
    // Object 1
    React.useLayoutEffect(() => {
        if (object1.current) {
            if (
                object1.current instanceof VolumeObject ||
                object1.current instanceof VolumeGroup
            ) {
                controls1.attach(object1.current);
            }
        }

        return () => void controls1.detach();
    }, [object1, controls1]);

    // Object 2
    React.useLayoutEffect(() => {
        if (object2.current) {
            if (
                object2.current instanceof VolumeObject ||
                object2.current instanceof VolumeGroup
            ) {
                controls2.attach(object2.current);
            }
        }

        return () => void controls2.detach();
    }, [object2, controls2]);

    // Push Planes
    React.useEffect(() => {
        controls1.clippingPlanes = Planes;
        controls1.clipIntersection = true;

        controls1.isType = "board";
    }, [controls1, Planes]);
    React.useEffect(() => {
        controls2.clippingPlanes = Planes;
        controls2.clipIntersection = true;

        controls2.invert = true;
        controls2.isType = "board";
    }, [controls2, Planes]);

    // Clipping
    React.useEffect(() => {
        controls1.clipping = clipping;
    }, [controls1, clipping]);
    React.useEffect(() => {
        controls2.clipping = clipping;
    }, [controls2, clipping]);

    return controls1 && controls2 ? (
        <>
            <primitive ref={ref} object={controls1} />
            <primitive object={controls2} />

            <group ref={boardRef} visible={clipping}>
                {/* 3D Object */}
                {children}
                <group ref={helperRef} visible={clipping ? visible : false}>
                    {/* Main and Helper */}
                    <mesh name="board" position={[0, 0, 0]}>
                        <boxBufferGeometry args={[width, height, 0.05]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaaaaaa)}
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="top" position={[0, height / 2, 0]}>
                        <planeGeometry args={[width, height]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaa0000)} // Red
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="right" position={[width / 2, 0, 0]}>
                        <planeGeometry args={[height, width]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0x00aa00)} // Green
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="bottom" position={[0, -height / 2, 0]}>
                        <planeGeometry args={[width, height]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0x0000aa)} // Blue
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="left" position={[-width / 2, 0, 0]}>
                        <planeGeometry args={[height, width]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaa00aa)} // Purple
                            wireframe={true}
                        />
                    </mesh>
                </group>
            </group>
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping ? visible : false}
                    />
                </>
            ))}

            {/* PivotControls */}
            <PivotControls
                ref={pivotRef}
                matrix={matrix}
                autoTransform={true}
                scale={subPlaneSize}
                onDrag={(l, deltaL, w, deltaW) => {
                    onDrag(l, deltaL, w, deltaW);
                }}
                onDragStart={() => {}}
                onDragEnd={() => {}}
            />
        </>
    ) : null;
});
