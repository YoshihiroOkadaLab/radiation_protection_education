import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <p className={styles.description}>
                    Get started by editing{" "}
                    <code className={styles.code}>pages/index.tsx</code>
                </p>
                <p>process.env.NODE_ENV {process.env.NODE_ENV}</p>

                <h2>Content</h2>
                <div className={styles.grid}>
                    <Link href={"/volume_visualization/nrrd_view"}>
                        <a className={styles.card}>
                            <h2>NRRD View &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </a>
                    </Link>

                    <Link href={"/volume_visualization/dose_visualization"}>
                        <a className={styles.card}>
                            <h2>Dose Visualization &rarr;</h2>
                            <p>Next.js + react-three/fiber, Texture 3D</p>
                        </a>
                    </Link>

                    <Link href={"/volume_visualization/dose_visualization_VR"}>
                        <a className={styles.card}>
                            <h2>Dose Visualization (Ver. VR)&rarr;</h2>
                            <p>
                                Next.js + react-three/fiber + react-three/xr,
                                Texture 3D
                            </p>
                        </a>
                    </Link>

                    <Link href={"/multiplay/game_template_test"}>
                        <a className={styles.card}>
                            <h2>Game Template</h2>
                            <p>Next.js + react-three/fiber</p>
                        </a>
                    </Link>
                </div>

                <h2>References</h2>
                <div className={styles.grid}>
                    <a
                        href="https://threejs.org/examples/?q=texture3d#webgl2_materials_texture3d"
                        className={styles.card}
                    >
                        <h2>Textrue3D example &rarr;</h2>
                        <p>Three.js examples</p>
                    </a>

                    <a
                        href="https://threejs.org/examples/?q=nrrd#webgl_loader_nrrd"
                        className={styles.card}
                    >
                        <h2>NRRDLoader example &rarr;</h2>
                        <p>Three.js examples</p>
                    </a>

                    <a
                        href="https://github.com/cornerstonejs/cornerstoneTools/issues/335#issuecomment-376008409"
                        className={styles.card}
                    >
                        <h2>NRRD Production example &rarr;</h2>
                        <p>Three.js + NRRD Production</p>
                    </a>

                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Documentation &rarr;</h2>
                        <p>
                            Find in-depth information about Next.js features and
                            API.
                        </p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>
                            Learn about Next.js in an interactive course with
                            quizzes!
                        </p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>
                            Discover and deploy boilerplate example Next.js
                            projects.
                        </p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL
                            with Vercel.
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <img
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
