"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work-item.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function WorkItem({ project, index, onHover, onLeave }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        const img = imageRef.current;

        // Parallax Effect
        gsap.fromTo(
            img,
            { y: "-10%" },
            {
                y: "10%",
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );

        // Title Reveal
        gsap.fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={styles.item}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            <div className={styles.index}>{project.id}</div>

            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image
                        ref={imageRef}
                        src={project.image}
                        alt={project.title}
                        fill
                        className={styles.image}
                        priority={index < 2} // Prioritize first two images
                    />
                </div>
                <h2 ref={titleRef} className={styles.title}>
                    {project.title}
                </h2>
                {/* Short description if needed, logic says user wants exact clone so checking if it's there. 
            The screenshot showed title centered below image or vice versa. sticking to plan. */}
                <p style={{ marginTop: '20px', maxWidth: '400px', fontSize: '1rem', opacity: 0.7 }}>
                    {project.description}
                </p>
            </div>

            <div className={styles.meta}>
                <div className={styles.tags}>
                    {project.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                    ))}
                </div>
                <div className={styles.year}>{project.year}</div>
            </div>
        </div>
    );
}
