import {
    NextPage,
    GetStaticPaths,
    GetStaticProps,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

import { googleFormsURL } from "utils/common/experimentsConfig";

import styles from "../../styles/css/home.module.css";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { type: "jp" },
            },
            {
                params: { type: "en" },
            },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const pageType = params!.type;

    const isEnglish = pageType === "en";

    return {
        props: {
            isEnglish: isEnglish,
        },
    };
};

const Experiment: NextPage = ({ ...props }: PageProps) => {
    const isEnglish = props.isEnglish;

    const [tutorialXRay, tutorialCArm, exerciseXRay, exerciseCArm] =
        useMemo(() => {
            const tutorial = !isEnglish ? "tutorial" : "tutorial_en";
            const exercise = !isEnglish ? "exercise" : "exercise_en";

            return [
                `/visualization/X-Ray/${tutorial}`,
                `/visualization/C-Arm/${tutorial}`,
                `/visualization/X-Ray/${exercise}`,
                `/visualization/C-Arm/${exercise}`,
            ];
        }, [isEnglish]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Radiation Protection Education</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Experiment</h1>

                <h2 className={`${styles.chapter} ${styles.isExperiment}`}>
                    {!isEnglish ? <>可視化教材</> : <>Visualization Material</>}
                </h2>
                <div className={styles.description}>
                    <ul>
                        <li>
                            {!isEnglish ? (
                                <>
                                    X-Ray，C-Armの少なくとも1つのシーンでTutorial，Exerciseを実施して
                                    <br />
                                    下さい。
                                </>
                            ) : (
                                <>
                                    Tutorial and Exercise should be performed on
                                    at least one scene in X-Ray and C-Arm.
                                </>
                            )}
                        </li>
                        <li>
                            {!isEnglish ? (
                                <>
                                    GPUを搭載したデバイスでの実施を推奨しています。
                                </>
                            ) : (
                                <>
                                    We recommend that this be done on a device
                                    with a GPU.
                                </>
                            )}
                        </li>
                        <li>
                            {!isEnglish ? (
                                <>
                                    スマートフォン，タブレットでの実施は，線量分布が正しく描画されないことがあるため，非推奨としています。
                                </>
                            ) : (
                                <>
                                    We do not recommend the use of smartphones
                                    and tablets because they may not render the
                                    dose distribution correctly.
                                </>
                            )}
                        </li>
                    </ul>
                </div>
                <h3 className={styles.section}>Tutorial</h3>
                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={tutorialXRay}>
                            <h2>X-Ray &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>Exerciseへ進む前に実施して下さい</>
                                ) : (
                                    <>
                                        Please implement before proceeding to
                                        Exercise
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={tutorialCArm}>
                            <h2>C-Arm &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>Exerciseへ進む前に実施して下さい</>
                                ) : (
                                    <>
                                        Please implement before proceeding to
                                        Exercise
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                </div>

                <h3 className={styles.section}>Execise</h3>
                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={exerciseXRay}>
                            <h2>X-Ray &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        先にTutorialを実施することを推奨しています
                                    </>
                                ) : (
                                    <>
                                        It is recommended that Tutorial be
                                        conducted first
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={exerciseCArm}>
                            <h2>C-Arm &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        先にTutorialを実施することを推奨しています
                                    </>
                                ) : (
                                    <>
                                        It is recommended that Tutorial be
                                        conducted first
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                </div>

                <h2 className={`${styles.chapter} ${styles.isExperiment}`}>
                    {!isEnglish ? <>VR教材</> : <>VR Material</>}
                </h2>
                <div className={styles.description}>
                    <ul>
                        <li>
                            {!isEnglish ? (
                                <>
                                    可視化教材と同様に，X-Ray，C-Armの少なくとも1つのシーンを実施して
                                    <br />
                                    下さい。
                                </>
                            ) : (
                                <>
                                    As with the visualization materials, at
                                    least one X-Ray or C-Arm scene should be
                                    performed.
                                </>
                            )}
                        </li>
                        <li>
                            {!isEnglish ? (
                                <>
                                    VR教材内にTipsを用意していないため，Documentを最初に確認して下さい。
                                </>
                            ) : (
                                <>
                                    Please check the Document first, as we do
                                    not provide tips in the VR materials.
                                </>
                            )}
                        </li>
                        <li>
                            {!isEnglish ? (
                                <>
                                    実験用のチェックリストも用意していないため，Document内で
                                    <br />
                                    説明されている動作を全て確認できましたら，Googleフォームの
                                    <br />
                                    回答に進んで下さい。
                                </>
                            ) : (
                                <>
                                    Since we do not have a checklist for
                                    experimentation, please proceed to answer
                                    the Google Form once you have confirmed all
                                    the behaviors described in the Document.
                                </>
                            )}
                        </li>
                    </ul>
                </div>
                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <a
                            href={
                                !isEnglish
                                    ? "https://github.com/Ireansan/radiation_protection_education/blob/develop/docs/manual/experiment/Experiment_VR.md"
                                    : "https://github.com/Ireansan/radiation_protection_education/blob/develop/docs/manual/experiment/Experiment_VR_en.md"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h2>Document (GitHub) &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        X-Ray, C-Armへ進む前に
                                        <br />
                                        確認して下さい
                                    </>
                                ) : (
                                    <>
                                        Please check before proceeding to X-Ray,
                                        C-Arm
                                    </>
                                )}
                            </p>
                        </a>
                    </div>
                </div>
                <div className={styles.grid}>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={"/VR/X-Ray"}>
                            <h2>X-Ray &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        Documentを確認してから，
                                        <br />
                                        Oculusでアクセスして下さい
                                    </>
                                ) : (
                                    <>
                                        Please check the Document,
                                        <br /> and then access it with Oculus
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                    <div className={`${styles.card} ${styles.isExperiment}`}>
                        <Link href={"/VR/C-Arm"}>
                            <h2>C-Arm &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        Documentを確認してから，
                                        <br />
                                        Oculusでアクセスして下さい
                                    </>
                                ) : (
                                    <>
                                        Please check the Document,
                                        <br /> and then access it with Oculus
                                    </>
                                )}
                            </p>
                        </Link>
                    </div>
                </div>

                <h2 className={`${styles.chapter} ${styles.isExperiment}`}>
                    {!isEnglish ? <>Google フォーム</> : <>Google Forms</>}
                </h2>
                <div className={styles.grid}>
                    <div
                        className={`${styles.card} ${styles.isExperiment} ${styles.googleForm}`}
                    >
                        <a
                            href={`${googleFormsURL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h2>Google Forms &rarr;</h2>
                            <p>
                                {!isEnglish ? (
                                    <>
                                        可視化教材とVR教材を実施してからアクセスして下さい
                                    </>
                                ) : (
                                    <>
                                        Please access the visualization and VR
                                        materials after they have been
                                        implemented.
                                    </>
                                )}
                            </p>
                        </a>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://github.com/Ireansan/radiation_protection_education"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    by Ireansan
                </a>
            </footer>
        </div>
    );
};

export default Experiment;
