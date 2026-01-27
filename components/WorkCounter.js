"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./work-counter.module.scss";

// Sub-component for an individual digit
function Digit({ value }) {
    const oldDigitRef = useRef(null);
    const newDigitRef = useRef(null);
    const prevValue = useRef(value);

    useEffect(() => {
        if (value === prevValue.current) return;

        // User requirement: "if the slide is in 01 moving to 02, only the 2 need to apper the 1 need to scrol and hide the 0 should be stable"
        // This implies: Only animate if the digit actually changes!
        // My Logic: `if (value === prevValue.current) return;` inside the EFFECT handles this partially?
        // Wait, the effect runs whenever `value` prop changes. 
        // If `value` is "1", and `prev` is "1", the effect might run if prop reference changes? No, primitives compare by value.
        // So `Digit` component simply WON'T animate if the value is the same.

        // However, we need to ensure the animation LOOKS correct. 
        // 0 -> 0 : No animation.
        // 1 -> 2 : Animation.
        // The implementation below DOES exactly that.

        const direction = parseInt(value) > (parseInt(prevValue.current) || 0) ? 1 : -1;

        const oldEl = oldDigitRef.current;
        const newEl = newDigitRef.current;

        // Position new char
        gsap.set(newEl, { y: direction * 100 + "%" });

        const tl = gsap.timeline();
        tl.to(oldEl, { y: direction * -100 + "%", duration: 0.5, ease: "power3.inOut" }, 0);
        tl.to(newEl, { y: "0%", duration: 0.5, ease: "power3.inOut" }, 0)
            .call(() => {
                prevValue.current = value;
            });

    }, [value]);

    return (
        <div className={styles.digitSlot}>
            <span ref={oldDigitRef} className={styles.digit}>{prevValue.current}</span>
            <span ref={newDigitRef} className={styles.digit}>{value}</span>
        </div>
    );
}

export default function WorkCounter({ currentId }) {
    // Ensure we always have 2 chars for consistency if "01" format is guaranteed.
    const chars = currentId.toString().split("");

    return (
        <div className={styles.counterWrapper}>
            <div className={styles.counterTrack}>
                {chars.map((char, i) => (
                    <Digit key={i} value={char} />
                ))}
            </div>
        </div>
    );
}
