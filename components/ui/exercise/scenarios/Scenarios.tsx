import React, { memo, useEffect } from "react";

import { useStore } from "../../../store";
import { Item, SubItem, NextButton, useScenario } from "../utils";
import type { ScenarioProps } from "../utils";

import style from "../../../../styles/css/exercise.module.css";

const MemoItem = memo(Item);
const MemoSubItem = memo(SubItem);

/**
 *
 */
export function Exercise1({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const RangeRadius = 0.7; // [m]
    const {
        distance,
        inRange,
        dosimeterResultsLength,
        yearWithin,
        onceWithin,
        allWithin,
        withinShield,
    } = useScenario({ distanceMax: RangeRadius });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise1: inRange && allWithin,
                },
            },
        }));
    }, [inRange, allWithin]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 1</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={inRange}>
                        {!isEnglish ? (
                            <></>
                        ) : (
                            <>Move Player to within {RangeRadius * 100} cm.</>
                        )}
                        <MemoSubItem isDone={inRange}>
                            Distance: {(distance * 100).toFixed()} /{" "}
                            {RangeRadius * 100} [cm]
                        </MemoSubItem>
                    </MemoItem>
                    <MemoItem isDone={allWithin}>
                        {!isEnglish ? (
                            <></>
                        ) : (
                            <>
                                All measurements are below the upper limit.
                                {/* All measurements below regulatory limits */}
                            </>
                        )}
                        <MemoSubItem isDone={allWithin}>
                            Year: {yearWithin} / {dosimeterResultsLength}
                            <br />
                            Once: {onceWithin} / {dosimeterResultsLength}
                        </MemoSubItem>
                    </MemoItem>
                    <MemoItem isDone={withinShield === 0}>
                        (Optional) No Shield
                        <MemoSubItem isDone={withinShield === 0}>
                            Shield: {withinShield} / {dosimeterResultsLength}
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise1} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise2Preparation({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const { dosimeterResultsLength, withinShield, equipmentsLength, equipped } =
        useScenario({
            distanceMin: undefined,
        });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise2Preparation: withinShield === 0 && equipped === 0,
                },
            },
        }));
    }, [withinShield, equipped]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 2 (Preparation)</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={withinShield === 0}>
                        {!isEnglish ? (
                            <></>
                        ) : (
                            <>
                                All measurements to be unaffected by Shield.
                                <br />
                                (Players should not be moved.)
                            </>
                        )}
                        <MemoSubItem isDone={withinShield === 0}>
                            Shield: {withinShield} / {dosimeterResultsLength}
                        </MemoSubItem>
                    </MemoItem>
                    <MemoItem isDone={equipped === 0}>
                        {!isEnglish ? <></> : <>Remove all Equipment.</>}
                        <MemoSubItem isDone={equipped === 0}>
                            Equipment: {equipped} / {equipmentsLength}
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise2Preparation} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise2({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const RangeRadius = 1.7; // [m]
    const { distance, inRange } = useScenario({
        distanceMin: RangeRadius,
    });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise2: inRange,
                },
            },
        }));
    }, [inRange]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 2</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={inRange}>
                        {!isEnglish ? (
                            <></>
                        ) : (
                            <>Move Player away to {RangeRadius} m.</>
                        )}
                        <MemoSubItem isDone={inRange}>
                            Distance: {distance.toFixed(2)} / {RangeRadius} [m]
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise2} />
            </div>
        </>
    );
}

/**
 *
 */
export function Exercise3({ isEnglish = false }: ScenarioProps) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const { dosimeterResultsLength, withinShield, allWithinShield } =
        useScenario({
            distanceMin: undefined,
        });

    useEffect(() => {
        set((state) => ({
            sceneStates: {
                ...state.sceneStates,
                exerciseProgress: {
                    ...state.sceneStates.exerciseProgress,
                    execise3: allWithinShield,
                },
            },
        }));
    }, [allWithinShield]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Exercise - 3</h3>
                <div className={`${style.items}`}>
                    <MemoItem isDone={allWithinShield}>
                        {!isEnglish ? (
                            <></>
                        ) : (
                            <>
                                All measuring points are under the influence of
                                Shield.
                            </>
                        )}
                        <MemoSubItem isDone={allWithinShield}>
                            Shield: {withinShield} / {dosimeterResultsLength}
                        </MemoSubItem>
                    </MemoItem>
                </div>
                <NextButton disabled={!exerciseProgress.execise3} />
            </div>
        </>
    );
}
