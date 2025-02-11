import {
    GetStaticPaths,
    GetStaticProps,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from "next";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PivotControls,
    Loader,
    Stats,
} from "@react-three/drei";
import * as THREE from "three";
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
} from "../../../components/game";

// ==========
// Model
import * as MODELS from "../../../components/models";
import { Board_Configure } from "../../../components/models";
import {
    CustomYBotIK,
    SelfMadePlayer,
} from "../../../components/models/Player";
import {
    HandIKLevaControls,
    HandIKPivotControls,
    PlayerPivotControls,
} from "../../../components/models/controls";

// ==========
// Volume
// ----------
// object
import { Dosimeter, DoseGroup, DoseAnimationObject } from "../../../src";
// ----------
// data
import * as ENVIROMENT from "../../../components/models/Environment";
import * as VOLUMEDATA from "../../../components/models/VolumeData";
// ----------
// controls
import {
    DoseAnimationControls,
    DoseAnimationControlsWithAudio,
    DoseAnimationControlsWithAudioUI,
    DoseBoardControls,
    DoseEquipmentsUI,
    DosimeterControls,
    DosimeterUI,
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../../components/volumeRender";

// ==========
// Controls
import { CustomOrbitControls } from "../../../components/controls";

// ==========
// UI
import { CoordHTML, SceneOptionsPanel } from "../../../components/ui";
import { Tips } from "../../../components/ui/tips";
import { Exercise, Tutorial } from "../../../components/ui/exercise";

// ==========
// Store
import { useStore } from "../../../components/store";

// ==========
// Utils
import { applyBasePath } from "../../../utils";

// ==========
// Styles
import styles from "../../../styles/threejs.module.css";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { type: "basic" },
            },
            {
                params: { type: "extra" },
            },
            {
                params: { type: "tutorial" },
            },
            {
                params: { type: "tutorial_en" },
            },
            {
                params: { type: "exercise" },
            },
            {
                params: { type: "exercise_en" },
            },
            {
                params: { type: "perspective" },
            },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const pageType = params!.type;

    const isBasic = pageType === "basic";
    const isExtra = pageType === "extra";
    const isTutorial = pageType === "tutorial" || pageType === "tutorial_en";
    const isExercise = pageType === "exercise" || pageType === "exercise_en";
    const isPerspective = pageType === "perspective";
    const isEnglish = pageType === "tutorial_en" || pageType === "exercise_en";

    return {
        props: {
            availables: {
                orthographic: !isPerspective,
                player: isExtra || isTutorial || isExercise || isPerspective,
                shield: isExtra || isTutorial || isExercise || isPerspective,
                dosimeter: isExtra || isTutorial || isExercise || isPerspective,
                experimentUI: isExercise,
                exerciseUI: isExtra || isExercise || isPerspective,
                tutorialUI: isTutorial,
            },
            isEnglish: isEnglish,
        },
    };
};

function VisualizationCArm({ ...props }: PageProps) {
    const [set, debug, viewing, objectVisibles, executeLog] = useStore(
        (state) => [
            state.set,
            state.debug,
            state.viewing,
            state.sceneStates.objectVisibles,
            state.sceneStates.executeLog,
        ]
    );

    const doseOriginPosition = new THREE.Vector3().fromArray(
        VOLUMEDATA.CArm_Configure.doseOrigin.position
    );
    set((state) => ({
        sceneStates: { ...state.sceneStates, doseOrigin: doseOriginPosition },
    }));

    const audioPath = `/models/nrrd/c-arm/animation/c-arm.mp3`;
    const names = [
        {
            name: "mixamorigLeftEyeDosimeter",
            displayName: "Left Eye",
            category: "goggle",
            coefficient: 0.1,
        },
        {
            name: "mixamorigRightEyeDosimeter",
            displayName: "Right Eye",
            category: "goggle",
            coefficient: 0.1,
        },
        {
            name: "mixamorigNeckDosimeter",
            displayName: "Neck",
            category: "neck",
            coefficient: 0.1,
        },
        {
            name: "mixamorigSpine1Dosimeter",
            displayName: "Chest",
            category: "apron",
            coefficient: 0.1,
        },
        {
            name: "mixamorigLeftHandDosimeter",
            displayName: "Left Hand",
            category: "glove",
            coefficient: 0.1,
        },
        {
            name: "mixamorigRightHandDosimeter",
            displayName: "Right Hand",
            category: "glove",
            coefficient: 0.1,
        },
    ];
    const ref = useRef<DoseGroup>(null);

    const timelapseRef = useRef<DoseGroup>(null);
    const cArmRef = useRef<DoseAnimationObject>(null);
    const cArmRoll180Pitch360Ref = useRef<DoseAnimationObject>(null);

    const accumulateRef = useRef<DoseGroup>(null);
    const cArmAccumuRef = useRef<DoseGroup>(null);
    const cArmRoll180Pitch360AccumuRef = useRef<DoseGroup>(null);

    const patientRef = useRef<THREE.Group>(null!);
    const cArmModelRef = useRef<THREE.Group>(null!);

    const originObjRef = useRef<THREE.Mesh>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null!);
    const audioRef = useRef<HTMLAudioElement>(null!);

    const options = ["type 1", "type 2"];
    const cArmConfigs = [
        {
            model: { ...VOLUMEDATA.CArm_Configure.object3d.model },
            patient: { ...VOLUMEDATA.CArm_Configure.object3d.patient },
        },
        {
            model: {
                ...VOLUMEDATA.CArm_roll180_pitch360_Configure.object3d.model,
            },
            patient: {
                ...VOLUMEDATA.CArm_roll180_pitch360_Configure.object3d.patient,
            },
        },
    ];
    const refs = [
        { time: cArmRef, accumu: cArmAccumuRef },
        { time: cArmRoll180Pitch360Ref, accumu: cArmRoll180Pitch360AccumuRef },
    ];
    const [,] = useControls(() => ({
        Scene: folder({
            Gimmick: folder({
                type: {
                    options: options,
                    value: options[0],
                    onChange: (e) => {
                        const visibles = options.map((value) => value === e);

                        visibles.forEach((value, index) => {
                            let config = cArmConfigs[index];

                            let refTime = refs[index].time.current;
                            refTime ? (refTime.visible = value) : null;
                            let refAccumu = refs[index].accumu.current;
                            refAccumu ? (refAccumu.visible = value) : null;

                            if (value) {
                                MODELS.updateCArmModel(
                                    cArmModelRef,
                                    config.model.position,
                                    config.model.rotation,
                                    config.model.roll,
                                    config.model.pitch,
                                    config.model.height
                                );
                                if (patientRef.current) {
                                    patientRef.current.position.set(
                                        ...config.patient.position
                                    );
                                    patientRef.current.rotation.set(
                                        ...config.patient.rotation
                                    );
                                    patientRef.current.scale.setScalar(
                                        config.patient.scale
                                    );
                                }
                            }
                        });

                        // set execute log for exercise
                        const _cArm = executeLog.gimmick.cArm;
                        _cArm[e] = true;

                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    gimmick: {
                                        ...state.sceneStates.executeLog.gimmick,
                                        cArm: _cArm,
                                    },
                                },
                            },
                        }));
                    },
                },
            }),
        }),
    }));

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
                        orthographic={props.availables.orthographic}
                        camera={{
                            position: [4, 8, 4],
                            zoom: props.availables.orthographic ? 75 : 1.0,
                        }}
                    >
                        <Suspense fallback={null}>
                            {/* -------------------------------------------------- */}
                            {/* Volume Object */}
                            <doseGroup
                                ref={ref}
                                visible={objectVisibles.dose}
                                position={
                                    VOLUMEDATA.CArm_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.CArm_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.CArm_Configure.volume.scale}
                            >
                                {/* ========================= */}
                                {/* Time Lapse */}
                                <doseGroup
                                    ref={timelapseRef}
                                    clim2={
                                        VOLUMEDATA.CArm_Configure.volume.clim2
                                            .timelapse
                                    }
                                    // clim2AutoUpdate={false}
                                >
                                    {/* ------------------------- */}
                                    {/* C-Arm Dose */}
                                    <doseAnimationObject ref={cArmRef}>
                                        <VOLUMEDATA.CArm_all_Animation />
                                    </doseAnimationObject>

                                    {/* ------------------------- */}
                                    {/* C-Arm Roll 180 Pitch 360 Dose */}
                                    <doseAnimationObject
                                        ref={cArmRoll180Pitch360Ref}
                                        visible={false}
                                    >
                                        <VOLUMEDATA.CArm_roll180_pitch360_all_Animation />
                                    </doseAnimationObject>
                                </doseGroup>

                                {/* ========================= */}
                                {/* Accumulate */}
                                <doseGroup
                                    ref={accumulateRef}
                                    visible={false}
                                    clim2={
                                        VOLUMEDATA.CArm_Configure.volume.clim2
                                            .accumulate
                                    }
                                    // clim2AutoUpdate={false}
                                >
                                    {/* ------------------------- */}
                                    {/* C-Arm Dose, Accumulate */}
                                    <doseGroup ref={cArmAccumuRef}>
                                        <VOLUMEDATA.CArm_all_accumulate />
                                    </doseGroup>

                                    {/* ------------------------- */}
                                    {/* C-Arm Roll 180 Pitch 360 Dose, Accumulate */}
                                    <doseGroup
                                        ref={cArmRoll180Pitch360AccumuRef}
                                        visible={false}
                                    >
                                        <VOLUMEDATA.CArm_roll180_pitch360_all_accumulate />
                                    </doseGroup>
                                </doseGroup>
                            </doseGroup>

                            {/* -------------------------------------------------- */}
                            {/* Three.js Object */}
                            {/* ========================= */}
                            {/* Machine & Patient */}
                            <group visible={objectVisibles.object3d}>
                                {/* ------------------------- */}
                                {/* Patient */}
                                <group
                                    ref={patientRef}
                                    position={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.object3d
                                            .patient.scale
                                    }
                                >
                                    <MODELS.XRay_Bed />
                                    <MODELS.XRay_Patient />
                                </group>

                                {/* ------------------------- */}
                                {/* C-Arm machine */}
                                <group
                                    ref={cArmModelRef}
                                    position={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.CArm_Configure.object3d.model
                                            .scale
                                    }
                                >
                                    <MODELS.CArmModel
                                        roll={
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.roll
                                        }
                                        pitch={
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.pitch
                                        }
                                        height={
                                            VOLUMEDATA.CArm_Configure.object3d
                                                .model.height
                                        }
                                    />
                                </group>
                            </group>

                            {/* ========================= */}
                            {/* Dose Origin */}
                            <mesh
                                ref={originObjRef}
                                position={doseOriginPosition}
                                scale={0.2}
                                visible={debug}
                            >
                                <sphereBufferGeometry args={[0.25]} />
                            </mesh>

                            {/* ========================= */}
                            {/* Avatar */}
                            {props.availables.player ? (
                                <>
                                    <PlayerPivotControls
                                        playerRef={yBotRef}
                                        dosimeterRef={dosimeterRef}
                                        position={new THREE.Vector3(1.5, 0, 0)}
                                        rotation={
                                            new THREE.Euler(0, -Math.PI / 2, 0)
                                        }
                                        scale={70}
                                        fixed={true}
                                        activeAxes={[true, false, true]}
                                    />
                                    <group
                                        ref={yBotRef}
                                        visible={objectVisibles.player}
                                        position={[1.5, 0, 0]}
                                        rotation={[0, -Math.PI / 2, 0]}
                                    >
                                        <SelfMadePlayer />
                                        {/* <HandIKPivotControls
                                            object={yBotRef}
                                            scale={35}
                                            fixed={true}
                                            visible={
                                                objectVisibles.playerHandPivot
                                            }
                                        /> */}
                                        <HandIKLevaControls object={yBotRef} />
                                        <CoordHTML
                                            origin={originObjRef}
                                            enableRotation={false}
                                            xzPlane={true}
                                        />
                                    </group>
                                </>
                            ) : null}

                            {/* -------------------------------------------------- */}
                            {/* Physics */}
                            <Physics gravity={[0, -30, 0]}>
                                <ToggledDebug />

                                {/* ========================= */}
                                {/* Shield */}
                                {props.availables.shield ? (
                                    <>
                                        <DoseBoardControls
                                            object={ref}
                                            origin={new THREE.Vector3(0, 1, 0)}
                                            areaSize={
                                                VOLUMEDATA.CArm_Configure.volume
                                                    .areaSize
                                            }
                                            width={Board_Configure.size.x}
                                            height={Board_Configure.size.y}
                                            position={
                                                new THREE.Vector3(
                                                    2.5,
                                                    1.25,
                                                    -0.5
                                                )
                                            }
                                            rotation={
                                                new THREE.Euler(
                                                    0,
                                                    Math.PI / 2,
                                                    0
                                                )
                                            }
                                            planeSize={Board_Configure.size.y}
                                            scale={60}
                                            fixed={true}
                                            offset={[0, 0, 0.1]}
                                            opacity={0.75}
                                            visible={
                                                objectVisibles.shield &&
                                                objectVisibles.shieldPivot
                                            }
                                        >
                                            <group>
                                                <mesh
                                                    visible={
                                                        objectVisibles.shield
                                                    }
                                                    position={[0, 0, 0]}
                                                    onPointerOver={(e) =>
                                                        console.log("Board", e)
                                                    }
                                                >
                                                    <boxBufferGeometry
                                                        args={[
                                                            ...Board_Configure.size.toArray(),
                                                        ]}
                                                    />
                                                    <meshBasicMaterial
                                                        color={
                                                            new THREE.Color(
                                                                0xb39a7b
                                                            )
                                                        }
                                                    />
                                                </mesh>
                                                <CoordHTML
                                                    origin={originObjRef}
                                                    enableDistance={false}
                                                />
                                            </group>
                                        </DoseBoardControls>
                                    </>
                                ) : null}
                            </Physics>

                            {/* -------------------------------------------------- */}
                            {/* Controls */}
                            {/* ========================= */}
                            {/* Volume Controls */}
                            {/* ------------------------- */}
                            {/* Animation Controls */}
                            {/* <DoseAnimationControls
                                objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                                duration={16}
                                speed={8}
                                customSpeed={[8.0, 16.0]}
                            /> */}
                            <DoseAnimationControlsWithAudio
                                audioRef={audioRef}
                                objects={[cArmRef, cArmRoll180Pitch360Ref]}
                                mainGroup={timelapseRef}
                                subGroup={accumulateRef}
                            />

                            {/* ------------------------- */}
                            {/* Parameter Controls */}
                            <VolumeParameterControls
                                object={ref}
                                clim2={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .accumulate
                                    // VOLUMEDATA.CArm_Configure.volume.clim2
                                    //     .timelapse
                                }
                                cmin={0}
                                cmax={
                                    VOLUMEDATA.CArm_Configure.volume.clim2
                                        .accumulate
                                }
                                climStep={
                                    VOLUMEDATA.CArm_Configure.volume.climStep
                                }
                            />

                            {/* ------------------------- */}
                            {/* Clipping Controls */}
                            <VolumeXYZClippingControls
                                object={ref}
                                planeSize={2}
                                areaSize={
                                    VOLUMEDATA.CArm_Configure.volume.areaSize
                                }
                                areaScale={1.1}
                                lineColor={new THREE.Color(0x6e0010)}
                            />

                            {/* ------------------------- */}
                            {/* Dosimeter */}
                            {props.availables.dosimeter ? (
                                <>
                                    <DosimeterControls
                                        ref={dosimeterRef}
                                        object={yBotRef}
                                        names={names}
                                        targets={[
                                            cArmAccumuRef,
                                            cArmRoll180Pitch360AccumuRef,
                                        ]}
                                    />
                                </>
                            ) : null}

                            {/* ========================= */}
                            {/* Three.js Controls */}
                            <CustomOrbitControls />

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

                            {/* -------------------------------------------------- */}
                            {/* UI (three.js) */}
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
                        </Suspense>
                    </Canvas>

                    {/* ================================================== */}
                    {/* UI */}
                    <Loader />
                    {/* -------------------------------------------------- */}
                    {/* Scene Options Controls UI */}
                    <SceneOptionsPanel activateStats={false} />

                    {/* -------------------------------------------------- */}
                    {/* Tips */}
                    <Tips isEnglish={props.isEnglish} />

                    {/* -------------------------------------------------- */}
                    {/* Animation Controls UI */}
                    <audio
                        src={applyBasePath(audioPath)}
                        ref={audioRef}
                        muted={true}
                    />
                    <DoseAnimationControlsWithAudioUI
                        audioRef={audioRef}
                        duration={16}
                        speed={8.0}
                        customSpeed={[8.0, 16.0]}
                    />

                    {/* -------------------------------------------------- */}
                    {/* Dosimeter UI */}
                    <div
                        className={`${
                            (!props.availables.dosimeter ||
                                !objectVisibles.dosimeterUI) &&
                            `${styles.isTransparent}`
                        }`}
                    >
                        <DoseEquipmentsUI />
                        <DosimeterUI nPerPatient={5e5} />
                    </div>

                    {/* -------------------------------------------------- */}
                    {/* Scenario UI */}
                    <div
                        className={`${
                            !objectVisibles.scenarioUI &&
                            `${styles.isTransparent}`
                        }`}
                    >
                        {props.availables.exerciseUI ? (
                            <>
                                <Exercise
                                    sceneName="C-Arm"
                                    isEnglish={props.isEnglish}
                                />
                            </>
                        ) : null}
                        {props.availables.tutorialUI ? (
                            <>
                                <Tutorial
                                    sceneName="C-Arm"
                                    isEnglish={props.isEnglish}
                                />
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

export default VisualizationCArm;
