"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./work-list.module.scss";
import WorkItem from "./WorkItem";
import WorkCounter from "./WorkCounter";
import { useLenis } from "@studio-freight/react-lenis";

export default function WorkList({ projects }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [progress, setProgress] = useState(0);
    const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || "01");
    const [displayName, setDisplayName] = useState("");

    // Get active project
    const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

    useLenis(({ progress }) => {
        setProgress(Math.round(progress * 100));
    });

    // Text scramble effect
    useEffect(() => {
        const targetText = activeProject.title;
        const characters = `@#$%&*/,?!+-=()[]{}"':;~`;
        const duration = 1000; // 1 second
        const frameRate = 30; // frames per second
        const totalFrames = (duration / 2000) * frameRate;
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            let scrambledText = '';
            for (let i = 0; i < targetText.length; i++) {
                if (targetText[i] === ' ') {
                    scrambledText += ' ';
                } else if (progress * targetText.length > i) {
                    // Gradually reveal real characters
                    const revealProgress = (progress * targetText.length - i);
                    if (revealProgress > 0.5) {
                        scrambledText += targetText[i];
                    } else {
                        scrambledText += characters[Math.floor(Math.random() * characters.length)];
                    }
                } else {
                    scrambledText += characters[Math.floor(Math.random() * characters.length)];
                }
            }

            setDisplayName(scrambledText);

            if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplayName(targetText);
            }
        }, 1000 / frameRate);

        return () => clearInterval(interval);
    }, [activeProject.title]);

    return (
        <>
            {/* Counter at top left */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 100,
                pointerEvents: 'none',
            }}>
                <WorkCounter currentId={activeProjectId} />
            </div>

            {/* Progress at middle right */}
            <div className={styles.progressFixed}>
                {progress} %
            </div>

            {/* Fixed bottom box */}
            <div className={styles.bottomBoxFixed}>
                <div className={styles.thumbnail}>
                    <Image
                        src={activeProject.image}
                        alt={activeProject.title}
                        fill
                        className={styles.thumbnailImage}
                    />
                </div>
                <div className={styles.boxInfo}>
                    <span className={styles.slideNumber}>
                        {activeProject.id}/{String(projects.length).padStart(2, '0')}
                    </span>
                    <span className={styles.slideName}>{displayName}</span>
                </div>
                <a href="#" className={styles.linkIcon} style={{ backgroundColor: activeProject.color || '#f5a623' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
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
