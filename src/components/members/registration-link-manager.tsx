
"use client";

import { useState, useActionState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
    Copy,
    Download,
    ExternalLink,
    QrCode,
    Share2,
} from "lucide-react";
import { generateRegistrationLink } from "@/actions/registration-link-actions";

type RegistrationLinkState = {
    error?: string;
    success?: string;
};

type RegistrationLinkManagerProps = {
    currentUrl: string | null;
    createdAt: string | null;
};

const initialState: RegistrationLinkState = {};

export default function RegistrationLinkManager({
    currentUrl,
    createdAt,
}: RegistrationLinkManagerProps) {
    const [state, formAction, isPending] = useActionState<
        RegistrationLinkState,
        FormData
    >(generateRegistrationLink, initialState);

    const [copyMessage, setCopyMessage] = useState("");

    async function copyLink() {
        if (!currentUrl) return;

        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopyMessage("Registration link copied.");
        } catch {
            setCopyMessage("Copy failed. Please copy the link manually.");
        }
    }

    function getQrCanvas(): HTMLCanvasElement | null {
        return document.querySelector<HTMLCanvasElement>(
            "#registration-qr canvas"
        );
    }

    function downloadQrCode() {
        const canvas = getQrCanvas();

        if (!canvas) {
            setCopyMessage("QR code is not ready yet. Please try again.");
            return;
        }

        const downloadUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "gic-member-registration-qr.png";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setCopyMessage("QR code downloaded.");
    }

    async function shareRegistrationLink() {
        if (!currentUrl) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "GIC Egbelu Church Member Registration",
                    text: "Use this link to register as a member of GIC Egbelu Church.",
                    url: currentUrl,
                });
            } else {
                await navigator.clipboard.writeText(currentUrl);
                setCopyMessage(
                    "Sharing is unavailable on this device. Link copied instead."
                );
            }
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            setCopyMessage("Unable to share. Try copying the registration link.");
        }
    }

    async function shareQrCode() {
        const canvas = getQrCanvas();

        if (!canvas || !currentUrl) {
            setCopyMessage("QR code is not ready yet. Please try again.");
            return;
        }

        try {
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, "image/png");
            });

            if (!blob) {
                throw new Error("Could not create QR image.");
            }

            const file = new File(
                [blob],
                "gic-member-registration-qr.png",
                { type: "image/png" }
            );

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {
                await navigator.share({
                    title: "GIC Egbelu Church Member Registration",
                    text: "Scan this QR code to register as a church member.",
                    files: [file],
                });
            } else {
                await shareRegistrationLink();
                setCopyMessage(
                    "Image sharing is unavailable here. Shared the registration link instead."
                );
            }
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            setCopyMessage(
                "Unable to share the QR image. Please download it and share it manually."
            );
        }
    }

    const buttonClass =
        "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60";

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <h2 className="text-lg font-bold tracking-tight">
                    Current registration link
                </h2>

                {currentUrl ? (
                    <>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Anyone with this link can open the public member
                            registration form. Regenerating the link invalidates
                            the previous link and QR code.
                        </p>

                        <div className="mt-4 break-all rounded-xl border border-border bg-muted/50 p-3 font-mono text-sm">
                            {currentUrl}
                        </div>

                        {createdAt && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Generated on{" "}
                                {new Date(createdAt).toLocaleString()}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={copyLink}
                                className={buttonClass}
                            >
                                <Copy size={16} />
                                Copy link
                            </button>

                            <button
                                type="button"
                                onClick={shareRegistrationLink}
                                className={buttonClass}
                            >
                                <ExternalLink size={16} />
                                Share link
                            </button>
                        </div>

                        <div className="mt-6 rounded-2xl border border-border p-5">
                            <div className="flex items-center gap-2">
                                <QrCode size={20} />
                                <h3 className="font-bold">
                                    Member registration QR code
                                </h3>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Scan this code with a phone camera to open the
                                registration form.
                            </p>

                            <div
                                id="registration-qr"
                                className="mt-5 flex justify-center rounded-xl bg-white p-5"
                            >
                                <QRCodeCanvas
                                    value={currentUrl}
                                    size={240}
                                    level="H"
                                    marginSize={4}
                                    title="GIC Egbelu member registration QR code"
                                />
                            </div>

                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                GIC Egbelu Church · Member Registration
                            </p>

                            <div className="mt-5 flex flex-wrap justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={downloadQrCode}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                >
                                    <Download size={16} />
                                    Download QR code
                                </button>

                                <button
                                    type="button"
                                    onClick={shareQrCode}
                                    className={buttonClass}
                                >
                                    <Share2 size={16} />
                                    Share QR code
                                </button>
                            </div>
                        </div>

                        {copyMessage && (
                            <p
                                className="mt-3 text-sm text-muted-foreground"
                                role="status"
                            >
                                {copyMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                        There is no active registration link yet. Generate one
                        below to enable public registration and create its QR code.
                    </p>
                )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <h2 className="text-lg font-bold tracking-tight">
                    Generate a new link
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Generating a new link will invalidate the current link.
                    Any previously printed QR codes will stop working.
                </p>

                {state.error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                    >
                        {state.error}
                    </p>
                )}

                {state.success && (
                    <p
                        role="status"
                        className="mt-4 rounded-xl border border-border bg-muted p-3 text-sm font-semibold text-foreground"
                    >
                        {state.success}
                    </p>
                )}

                <form action={formAction} className="mt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending
                            ? "Generating link..."
                            : currentUrl
                              ? "Regenerate registration link"
                              : "Generate registration link"}
                    </button>
                </form>
            </section>
        </div>
    );
}
