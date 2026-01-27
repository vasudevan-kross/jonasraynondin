"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work-item.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function WorkItem({ project, index, onHover, onLeave, onVisible }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const yearRef = useRef(null);
    const contentTopRef = useRef(null);
    const descriptionRef = useRef(null);
    const [displayTitle, setDisplayTitle] = useState("");
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const hasInitialized = useRef(false);

    const onVisibleRef = useRef(onVisible);

    // Split description into words for progressive reveal
    const descriptionWords = project.description.split(' ');

    // Keep ref updated
    useEffect(() => {
        onVisibleRef.current = onVisible;
    }, [onVisible]);

    // Text scramble effect for title - triggered by shouldAnimate
    useEffect(() => {
        if (!shouldAnimate) return;

        if (!hasInitialized.current) {
            hasInitialized.current = true;
        }

        const targetText = project.title;
        const characters = `@#$%&*/,?!+-=()[]{}"':;~`;
        const duration = 800;
        const frameRate = 30;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        // Start with fully scrambled text
        let initialScrambled = '';
        for (let i = 0; i < targetText.length; i++) {
            if (targetText[i] === ' ') {
                initialScrambled += ' ';
            } else {
                initialScrambled += characters[Math.floor(Math.random() * characters.length)];
            }
        }
        setDisplayTitle(initialScrambled);

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            let scrambledText = '';
            for (let i = 0; i < targetText.length; i++) {
                if (targetText[i] === ' ') {
                    scrambledText += ' ';
                } else if (progress * targetText.length > i) {
                    const revealProgress = (progress * targetText.length - i);
                    if (revealProgress > 0.7) {
                        scrambledText += targetText[i];
                    } else {
                        scrambledText += characters[Math.floor(Math.random() * characters.length)];
                    }
                } else {
                    scrambledText += characters[Math.floor(Math.random() * characters.length)];
                }
            }

            setDisplayTitle(scrambledText);

            if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplayTitle(targetText);
                setShouldAnimate(false);
            }
        }, 1000 / frameRate);

        return () => clearInterval(interval);
    }, [shouldAnimate, project.title]);

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

        // Year scroll animation
        gsap.to(yearRef.current, {
            y: -50,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "+=50%",
                scrub: 1,
            },
        });

        // Content scroll animation
        gsap.to(contentTopRef.current, {
            y: -100,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "+=50%",
                scrub: 1,
            },
        });

        // Progressive text highlight for description words
        const descWords = descriptionRef.current?.querySelectorAll('.word');
        if (descWords && descWords.length > 0) {
            descWords.forEach((word, i) => {
                gsap.fromTo(
                    word,
                    {
                        opacity: 0.3,
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                    {
                        opacity: 1,
                        color: project.color,
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 60%",
                            end: "center 40%",
                            scrub: true,
                            onUpdate: (self) => {
                                const progress = self.progress;
                                const wordProgress = (i / descWords.length);
                                if (progress > wordProgress) {
                                    gsap.to(word, { opacity: 1, color: project.color, duration: 0.3 });
                                }
                            }
                        }
                    }
                );
            });
        }

        // Progressive highlight for year
        gsap.fromTo(
            yearRef.current,
            {
                opacity: 0.3,
                color: 'rgba(255, 255, 255, 0.5)'
            },
            {
                opacity: 1,
                color: '#ffffff',
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top 60%",
                    end: "top 30%",
                    scrub: true,
                }
            }
        );

        // Active Index Trigger with animation trigger
        ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                if (onVisibleRef.current) onVisibleRef.current();
                setShouldAnimate(true);
            },
            onEnterBack: () => {
                if (onVisibleRef.current) onVisibleRef.current();
                setShouldAnimate(true);
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [project.color]);

    return (
        <div
            ref={containerRef}
            className={styles.page}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* <div className={styles.index} style={{ opacity: 0 }}>{project.id}</div> Removed logic entirely */}

            <section className="block-project">
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


                <div ref={contentTopRef} className="block-project__inner">
                    <div className="block-project__inner__header">
                        <h2 ref={titleRef}>
                            {displayTitle || '\u00A0'}
                        </h2>
                        {/* Year at top right */}
                        <div ref={yearRef} className={styles.yearDisplay}>{project.year}</div>
                    </div>

                    {/* Content at center top */}
                    <div className="block-project__inner__infos">

                        <div className="block-project__inner__infos__tags">
                            {project.tags.map((tag, i) => (
                                <span className="tag" key={i}>{tag}</span>
                            ))}
                        </div>

                        <div className="block-project__inner__infos__text">
                            <p ref={descriptionRef} className={styles.description}>
                                {descriptionWords.map((word, i) => (
                                    <span key={i} className="word">
                                        {word}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Previously meta was here, now integrated into textOverlay */}
        </div>
    );
}
