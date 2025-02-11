import React, { memo, useEffect, useMemo } from "react";

import { useStore } from "../../../store";
import { Item, SubItem, NextButton, LinkButton, useScenario } from "../utils";
import type { ScenarioProps } from "../utils";

import style from "../../../../styles/css/exercise.module.css";

const MemoItem = memo(Item);
const MemoSubItem = memo(SubItem);

/**
 *
 */
export type Exercise1Props = {
    radius: number;
} & ScenarioProps;
export function Exercise1({ radius, isEnglish = false }: Exercise1Props) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const {
        distance,
        inRange,
        dosimeterResultsLength,
        yearWithin,
        onceWithin,
        allWithin,
        withinShield,
    } = useScenario({ distanceMax: radius });

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
                            <>
                                プレイヤーを{(radius * 100).toFixed()}
                                cm以内に移動させる
                            </>
                        ) : (
                            <>
                                Move Player to within {(radius * 100).toFixed()}
                                cm.
                            </>
                        )}
                        <MemoSubItem isDone={inRange}>
                            Distance: {(distance * 100).toFixed()} /{" "}
                            {(radius * 100).toFixed()} [cm]
                        </MemoSubItem>
                    </MemoItem>
                    <MemoItem isDone={allWithin}>
                        {!isEnglish ? (
                            <>全ての測定値が上限被ばく量を下回る</>
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
                        (Optional){" "}
                        {!isEnglish ? <>防護板を使用しない</> : <>No Shield</>}
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
                            <>
                                全ての測定値が防護板の影響を受けない状態にする
                                <br />
                                (プレイヤーを移動させないこと)
                            </>
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
                        {!isEnglish ? (
                            <>全ての防護具を外す</>
                        ) : (
                            <>Remove all Equipment.</>
                        )}
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
export function Exercise2({ radius, isEnglish = false }: Exercise1Props) {
    const [set, exerciseProgress] = useStore((state) => [
        state.set,
        state.sceneStates.exerciseProgress,
    ]);

    const { distance, inRange } = useScenario({
        distanceMin: radius,
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
                            <>
                                プレイヤーを{radius}
                                mまで遠ざけ，被ばく量の変化を観察する
                            </>
                        ) : (
                            <>
                                Move Player away to {radius}m and observe the
                                change in exposure.
                            </>
                        )}
                        <MemoSubItem isDone={inRange}>
                            Distance: {distance.toFixed(2)} / {radius} [m]
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
                            <>
                                全ての測量値が防護板の影響を受けている状態にする
                            </>
                        ) : (
                            <>
                                All measurements are under the influence of
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

/**
 *
 */
export function BackExperiment({ isEnglish = false }: ScenarioProps) {
    const [set] = useStore((state) => [state.set]);

    const link = useMemo(() => {
        let _isEnglish = isEnglish ? "en" : "jp";

        return `/experiment/${_isEnglish}/`;
    }, [isEnglish]);

    return (
        <>
            <div className={`${style.content}`}>
                <h3>Congratulations!</h3>
                <LinkButton href={link}>
                    <p style={{ margin: 0, fontSize: "1rem" }}>
                        Back to <br />
                        Experiment Page
                        <br />
                        &rarr;
                    </p>
                </LinkButton>
            </div>
        </>
    );
}
