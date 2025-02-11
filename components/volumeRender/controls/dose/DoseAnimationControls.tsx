import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";

// ==========
// Volume
// ----------
// object
import {
    VolumeBase,
    DoseAnimationObject,
    VolumeAnimationObject,
} from "../../../../src";

// ==========
// Store
import { useStore } from "../../../store";

export type DoseAnimationControlsProps = {
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    mainGroup: React.RefObject<VolumeBase>;
    subGroup?: React.RefObject<VolumeBase>;
    duration: number;
    mode?: string;
    speed?: number;
    customSpeed?: number[];
};
/**
 * Animation controller for volume rendering objects (dose) and mode controller for dose data.
 * @param objects - target volume object.
 * @param mainGroup - time lapse volume group.
 * @param subGroup - accumulate volume group.
 * @param duration - duration of animation.
 * @param mode - mode of data. Default is `time lapse`.
 * @param speed - speed of animation playback. Default is `1.0`.
 * @param customSpeed - custom speed list of animation playback.
 */
export function DoseAnimationControls({
    objects,
    mainGroup,
    subGroup,
    duration,
    mode = "time lapse",
    speed = 1.0,
    customSpeed,
    ...props
}: DoseAnimationControlsProps) {
    // ==================================================
    // Variable, State
    // --------------------------------------------------
    // useStore
    const [set, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates,
    ]);

    // --------------------------------------------------
    // Speed list
    let speedListTmp = [0.25, 0.5, 1.0, 1.5, 2.0];
    const speedList = customSpeed
        ? speedListTmp.concat(customSpeed)
        : speedListTmp;

    // --------------------------------------------------
    // ref
    const childMaxLength = React.useRef<{
        index: number;
        length: number;
    }>({
        index: 0,
        length: 1,
    });

    // --------------------------------------------------
    // Animation mixer, actions
    /**
     * @link https://github.com/pmndrs/drei/blob/cce70ae77b5151601089114259fbffab8747c8fa/src/core/useAnimations.tsx
     */
    const [mixer] = React.useState<THREE.AnimationMixer[]>(
        objects.map(
            (object, i) =>
                new THREE.AnimationMixer(undefined as unknown as THREE.Object3D)
        )
    );
    const [actions, setActions] = React.useState(() => {
        const actions = objects.map((object, i) => {
            return {};
        }) as {
            [key in THREE.AnimationClip["name"]]: THREE.AnimationAction | null;
        }[];

        return actions;
    });
    const lazyActions = React.useRef<
        {
            [key: string]: THREE.AnimationAction | null;
        }[]
    >(
        objects.map((object, i) => {
            return {};
        })
    );

    // --------------------------------------------------
    // Control Panel
    /**
     * leva panels
     *
     * @link https://codesandbox.io/s/leva-theme-j0q0j?file=/src/App.jsx
     * @link https://codesandbox.io/s/leva-custom-plugin-l4xmm?file=/src/App.tsx
     */
    const [edit, setEdit] = React.useState<boolean>(false);
    const [animationConfig, setAnimationConfig] = useControls(() => ({
        Data: folder(
            {
                mode: {
                    value: mode,
                    options: ["time lapse", "accumulate"],
                    order: -2,
                    onChange: (e) => {
                        if (e === "time lapse") {
                            mainGroup.current
                                ? (mainGroup.current.visible = true)
                                : null;

                            if (subGroup) {
                                subGroup.current
                                    ? (subGroup.current.visible = false)
                                    : null;
                            }
                        } else if (e === "accumulate") {
                            mainGroup.current
                                ? (mainGroup.current.visible = false)
                                : null;

                            if (subGroup) {
                                subGroup.current
                                    ? (subGroup.current.visible = true)
                                    : null;
                            }
                        } else {
                            console.log("test");
                        }

                        // set execute log for experiment
                        const _animation = sceneStates.executeLog.animation;
                        _animation[e] = true;

                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    animation: _animation,
                                },
                            },
                        }));
                    },
                },
                Animation: folder({
                    play: {
                        value: true,
                        onChange: (e) => {
                            lazyActions.current.forEach((actions) => {
                                actions["volumeAnimation"]
                                    ? (actions["volumeAnimation"].paused = !e)
                                    : null;
                            });
                        },
                    },
                    speed: {
                        value: speed,
                        options: speedList,
                    },
                    time: {
                        value: 0,
                        min: 0,
                        max: duration,
                        step: 1,
                        onEditStart: (value, path, context) => {
                            setEdit(true);
                        },
                        onEditEnd: (value, path, context) => {
                            setEdit(false);
                        },
                    },
                }),
            },
            { order: 1 }
        ),
    }));

    // ==================================================
    // Hooks (Effect)
    // --------------------------------------------------
    // set actions
    React.useEffect(() => {
        objects.forEach((object, i) => {
            if (object.current) {
                object.current.animations.forEach((clip) => {
                    lazyActions.current[i][clip.name] = mixer[i].clipAction(
                        clip,
                        object.current!
                    );

                    if (childMaxLength.current.length <= clip.duration) {
                        childMaxLength.current = {
                            index: i,
                            length: clip.duration,
                        };
                    }
                });
            }
        });
        setActions(lazyActions.current);

        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [objects]);

    // --------------------------------------------------
    // play actions
    React.useEffect(() => {
        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play()
        );
    }, [actions]);

    // --------------------------------------------------
    // Frame
    useFrame((state, delta) => {
        if (mainGroup.current?.visible) {
            if (edit) {
                actions.forEach((actions, i) => {
                    actions["volumeAnimation"]
                        ? (actions["volumeAnimation"].time =
                              animationConfig.time)
                        : null;
                });
                mixer.forEach((mixer, i) => {
                    mixer.update(0);
                });
            } else {
                mixer.forEach((mixer) => {
                    mixer.update(delta * animationConfig.speed);
                });
            }

            let actionsMaxLength = actions[childMaxLength.current.index];
            if (actionsMaxLength["volumeAnimation"]) {
                actionsMaxLength["volumeAnimation"].time !==
                    animationConfig.time &&
                actionsMaxLength["volumeAnimation"].time < duration
                    ? setAnimationConfig({
                          time: actionsMaxLength["volumeAnimation"].time,
                      })
                    : null;
            }

            if (objects) {
                objects.forEach((object) => {
                    if (object.current) {
                        object.current.index = Math.floor(animationConfig.time);
                    }
                });
            }
        } else {
        }
    });

    // ==================================================
    // Element
    return (
        <>
            {/* {console.log("animation rendering")} */}
            {/* {console.log("animation", childMaxLength, mixer)} */}
        </>
    );
}
