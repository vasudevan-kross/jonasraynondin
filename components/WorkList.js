"use client";
import React, { useState, useEffect } from "react";
import styles from "./work-list.module.scss";
import WorkItem from "./WorkItem";
import WorkCounter from "./WorkCounter";
import { useLenis } from "@studio-freight/react-lenis";

export default function WorkList({ projects }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [progress, setProgress] = useState(0);
    const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || "01");

    useLenis(({ progress }) => {
        setProgress(Math.round(progress * 100));
    });

    return (
        <>
            <div className={styles.scrollProgress}>{progress} %</div>

            <div style={{
                position: 'fixed',
                top: '20px', // Adjusted to match left padding
                left: '20px',
                zIndex: 100, // Increased z-index
                pointerEvents: 'none',
                mixBlendMode: 'difference' // MOVED blend mode here to ensure it applies to the whole fixed block against the backdrop
            }}>
                <WorkCounter currentId={activeProjectId} />
            </div>

            <div className="container" style={{ position: 'relative', width: '100%', maxWidth: '100%', padding: 0 }}>

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
                                onVisible={() => setActiveProjectId(project.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
