"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work-item.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function WorkItem({ project, index, onHover, onLeave, onVisible }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);

    const onVisibleRef = useRef(onVisible);

    // Keep ref updated
    useEffect(() => {
        onVisibleRef.current = onVisible;
    }, [onVisible]);

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

        // Active Index Trigger
        ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => onVisibleRef.current && onVisibleRef.current(),
            onEnterBack: () => onVisibleRef.current && onVisibleRef.current(),
        });

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
            {/* <div className={styles.index} style={{ opacity: 0 }}>{project.id}</div> Removed logic entirely */}

            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image
                        ref={imageRef}
                        src={project.image}
                        alt={project.title}
                        fill
                        className={styles.image}
                        priority={index < 2}
                    />
                    <div className={styles.overlay} />
                </div>

                <div className={styles.textOverlay}>
                    {/* Year separate at top of block? */}
                    <div className={styles.yearDisplay}>{project.year}</div>

                    <h2 ref={titleRef} className={styles.title}>
                        {project.title}
                    </h2>

                    <div className={styles.meta}>
                        <div className={styles.tags}>
                            {project.tags.map((tag, i) => (
                                <span key={i}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <p style={{ marginTop: '10px', maxWidth: '300px', fontSize: '0.9rem', opacity: 0.8, textAlign: 'right' }}>
                        {project.description}
                    </p>
                </div>
            </div>

            {/* Previously meta was here, now integrated into textOverlay */}
        </div>
    );
}
