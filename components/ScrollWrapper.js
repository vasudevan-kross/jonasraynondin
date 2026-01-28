"use client";
import { ReactLenis } from "lenis/react";

export default function ScrollWrapper({ children }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false
            }}
        >
            {children}
        </ReactLenis>
    );
}
