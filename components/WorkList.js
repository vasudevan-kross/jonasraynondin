"use client";
import React, { useState, useEffect } from "react";
import styles from "./work-list.module.scss";
import WorkItem from "./WorkItem";
import { useLenis } from "@studio-freight/react-lenis";

export default function WorkList({ projects }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [progress, setProgress] = useState(0);

    useLenis(({ progress }) => {
        setProgress(Math.round(progress * 100));
    });

    return (
        <>
            <div className={styles.scrollProgress}>{progress} %</div>

            <div className="container">
                <header className={styles.header}>
                    <h1>WORK</h1>
                </header>

                <div className={styles.list}>
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={hoveredIndex !== null && hoveredIndex !== index ? styles.dimmed : ""}
                            style={{ transition: 'opacity 0.4s ease', opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1 }}
                        >
                            <WorkItem
                                project={project}
                                index={index}
                                onHover={() => setHoveredIndex(index)}
                                onLeave={() => setHoveredIndex(null)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
