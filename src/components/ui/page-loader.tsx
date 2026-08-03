"use client";

import Image from "next/image";

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e2d33]">
            {/* Soft ambient glow */}
            <div className="absolute h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            {/* Logo with scale + fade-in animation */}
            <div className="relative mb-10 animate-[logo-enter_1.1s_ease-out_forwards] opacity-0">
                <Image
                    src="/logo.png"
                    alt="GIC Egbelu Workforce"
                    width={120}
                    height={120}
                    loading="eager"
                    priority
                />
            </div>

            {/* Text that appears slightly later */}
            <p className="mb-8 animate-[fade-in_0.8s_ease-out_0.4s_forwards] text-sm font-medium tracking-wide text-white/70 opacity-0">
                Loading...
            </p>

            {/* Elegant thin progress bar */}
            <div className="h-1 w-52 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/2 animate-[loading_1.6s_ease-in-out_infinite] rounded-full bg-white/80" />
            </div>
        </div>
    );
}