"use client";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function ScrollWrapper({ children }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, normalizeWheel: true }}>
            {children}
        </ReactLenis>
    );
}
