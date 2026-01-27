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

    // Projects that should have dark icon color
    const darkIconProjects = ["02", "04", "05", "07", "10", "11", "12", "13"];
    const iconColorClass = darkIconProjects.includes(activeProjectId) ? "color-dark" : "color-light";

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
            {/* Fixed bottom box */}
            <div className="nav nav--projects">
                <div className="nav-projects-hoverable-zone">
                    <a href="/" className="nav-button nav-button--close" title="Go to Home"><div className="nav-button__icon"><span ></span><span ></span></div></a>
                    <button className="nav-button nav-button--up" aria-label="Previous project">
                        <div className="nav-button__icon">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5191 0L7.61198 3.06581C7.87041 3.32191 8 3.66096 8 4C8 4.33904 7.87041 4.67809 7.61198 4.93419L4.5191 8C4.29437 7.80778 4.08372 7.60022 3.8941 7.37376L6.8533 4.44043H0.0225687C0.0104561 4.29498 0 4 0 4C0 4 0.010417 3.70525 0.0225682 3.55957H6.8533L3.8941 0.626237C4.08382 0.399662 4.29424 0.192296 4.5191 0Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </button>
                    <button className="nav-button nav-button--down" aria-label="Next project">
                        <div className="nav-button__icon">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5191 0L7.61198 3.06581C7.87041 3.32191 8 3.66096 8 4C8 4.33904 7.87041 4.67809 7.61198 4.93419L4.5191 8C4.29437 7.80778 4.08372 7.60022 3.8941 7.37376L6.8533 4.44043H0.0225687C0.0104561 4.29498 0 4 0 4C0 4 0.010417 3.70525 0.0225682 3.55957H6.8533L3.8941 0.626237C4.08382 0.399662 4.29424 0.192296 4.5191 0Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </button>
                    <button className="nav-button nav-button--list" aria-label="Show project list">
                        <div className="nav-button__icon">
                            <span>
                            </span><span>
                            </span>
                        </div>
                    </button>
                    <div className="nav-projects">
                        <div className="nav-project-current active">
                            <div className="nav-project-current__media">
                                <img
                                    src={activeProject.image}
                                    alt={activeProject.title}
                                    fill="true"
                                    loading="lazy"
                                    className={styles.thumbnailImage}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="nav-project-current__inner">
                                <span className="nav-project-current__inner__number">
                                    {activeProject.id}/{String(projects.length).padStart(2, '0')}
                                </span>
                                <span className="nav-project-current__inner__title">
                                    {displayName}
                                </span>
                            </div>
                            <div className="nav-project-current__icon" style={{ backgroundColor: activeProject.color || '#f5a623' }}>
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconColorClass}>
                                    <path d="M4.5191 0L7.61198 3.06581C7.87041 3.32191 8 3.66096 8 4C8 4.33904 7.87041 4.67809 7.61198 4.93419L4.5191 8C4.29437 7.80778 4.08372 7.60022 3.8941 7.37376L6.8533 4.44043H0.0225687C0.0104561 4.29498 0 4 0 4C0 4 0.010417 3.70525 0.0225682 3.55957H6.8533L3.8941 0.626237C4.08382 0.399662 4.29424 0.192296 4.5191 0Z" fill="currentColor"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
            {/* <div className={styles.bottomBoxFixed}>
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
            </div> */}

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
