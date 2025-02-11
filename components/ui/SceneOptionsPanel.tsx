/**
 * @link https://codesandbox.io/s/racing-game-lo6kp?file=/src/ui/Editor.ts
 */

import { folder, useControls } from "leva";

import { useStore } from "../store";

type SceneOptionsPanelProps = {
    activateViewing?: boolean;
    activateAnnotations?: boolean;
    activateStats?: boolean;
};
export function SceneOptionsPanel({
    activateViewing = true,
    activateAnnotations = true,
    activateStats = true,
}: SceneOptionsPanelProps) {
    const [set, debug, viewing, annotations, stats, objectVisibles] = useStore(
        (state) => [
            state.set,
            state.debug,
            state.viewing,
            state.annotations,
            state.stats,
            state.sceneStates.objectVisibles,
        ]
    );

    const backgroundColorOptions = ["default", "red", "green", "blue"];

    const [, setDebug] = useControls(() => ({
        Scene: folder(
            {
                Gimmick: folder(
                    {
                        viewing: {
                            value: viewing,
                            onChange: (viewing) => set({ viewing }),
                            render: () => {
                                return activateViewing;
                            },
                        },
                    },
                    { order: -1 }
                ),
                Options: folder(
                    {
                        Debug: folder(
                            {
                                debug: {
                                    value: debug,
                                    onChange: (debug) => set({ debug }),
                                },
                                stats: {
                                    value: stats,
                                    onChange: (stats) => set({ stats }),
                                    render: () => {
                                        return activateStats;
                                    },
                                },
                                annotations: {
                                    value: annotations,
                                    onChange: (annotations) =>
                                        set({ annotations }),
                                    render: () => {
                                        return activateAnnotations;
                                    },
                                },
                                Visibles: folder(
                                    {
                                        dose: {
                                            value: objectVisibles.dose,
                                            onChange: (e) => {
                                                set((state) => ({
                                                    sceneStates: {
                                                        ...state.sceneStates,
                                                        objectVisibles: {
                                                            ...state.sceneStates
                                                                .objectVisibles,
                                                            dose: e,
                                                        },
                                                    },
                                                }));
                                            },
                                        },
                                        object3d: {
                                            value: objectVisibles.object3d,
                                            onChange: (e) => {
                                                set((state) => ({
                                                    sceneStates: {
                                                        ...state.sceneStates,
                                                        objectVisibles: {
                                                            ...state.sceneStates
                                                                .objectVisibles,
                                                            object3d: e,
                                                        },
                                                    },
                                                }));
                                            },
                                        },
                                        Player: folder({
                                            player: {
                                                value: objectVisibles.player,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                player: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                            playerPivot: {
                                                value: objectVisibles.playerPivot,
                                                label: "Pivot",
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                playerPivot: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                            playerHandPivot: {
                                                value: objectVisibles.playerHandPivot,
                                                label: "HandIK",
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                playerHandPivot:
                                                                    e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                        }),
                                        Shield: folder({
                                            shield: {
                                                value: objectVisibles.shield,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                shield: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                            shieldPivot: {
                                                value: objectVisibles.shieldPivot,
                                                label: "Pivot",
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                shieldPivot: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                        }),
                                        UI: folder({
                                            dosimeterUI: {
                                                value: objectVisibles.dosimeterUI,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                dosimeterUI: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                            scenarioUI: {
                                                value: objectVisibles.scenarioUI,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                scenarioUI: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                        }),
                                        Enviroment: folder({
                                            grid: {
                                                value: objectVisibles.grid,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                grid: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                            gizmo: {
                                                value: objectVisibles.gizmo,
                                                onChange: (e) => {
                                                    set((state) => ({
                                                        sceneStates: {
                                                            ...state.sceneStates,
                                                            objectVisibles: {
                                                                ...state
                                                                    .sceneStates
                                                                    .objectVisibles,
                                                                gizmo: e,
                                                            },
                                                        },
                                                    }));
                                                },
                                            },
                                        }),
                                    },
                                    { collapsed: true }
                                ),
                            },
                            { collapsed: true }
                        ),
                    },
                    { order: 1, collapsed: true }
                ),
            },
            { order: -2 }
        ),
    }));

    return <></>;
}
