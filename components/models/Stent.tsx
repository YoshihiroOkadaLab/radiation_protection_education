import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProps } from "./types";
import { Object } from "../volumeRender";

import { applyBasePath } from "../utils";
const modelURL = applyBasePath(`/models/nrrd/stent.nrrd`);

export function Stent({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    clipping = false,
    ...props
}: modelProps) {
    const volume: any = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <Object
                volume={volume}
                clipping={clipping}
                position={position}
                rotation={rotation}
                scale={scale}
                {...props}
            />
        </>
    );
}
