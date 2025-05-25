"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

function QrCodeScanner() {
    const pathname = usePathname();
    const router = useRouter();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanned, setScanned] = useState(false);
    const stopScannerRef = useRef<() => Promise<void> | null>(null);

    useEffect(() => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader");
        }
        const qrScanner = scannerRef.current;
        const startScanner = async () => {
            try {
                await qrScanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 300, height: 300 } },
                    async (decodedText) => {
                        if (scanned) return;
                        setScanned(true);
                        toast.success("QR Code Scanned Successfully!", { duration: 1000 });
                        await stopScannerRef.current?.();
                        const scannedPathName = decodedText.replace("http://localhost:3000/", "/");
                        router.push(scannedPathName);
                    },
                    (errorMessage) => console.warn("QR Scanner Error:", errorMessage)
                );
            } catch (err) {
                console.error("Camera access error:", err);
                toast.error("Failed to access camera. Please check permissions.");
            }
        };

        const stopScanner = async () => {
            try {
                if (qrScanner.isScanning) {
                    await qrScanner.stop();
                    qrScanner.clear();
                    console.log("Camera stopped successfully.");
                }
            } catch (error) {
                console.error("Error stopping camera:", error);
            }
        };
        stopScannerRef.current = stopScanner;

        startScanner();
        const handleBack = () => stopScanner();
        window.addEventListener("popstate", handleBack);
        return () => {
            stopScanner();
            window.removeEventListener("popstate", handleBack);
        };
    }, [scanned,router]);

    useEffect(() => {
        return () => {
            stopScannerRef.current?.();
        };
    }, [pathname,router]);

    return <div id="reader" style={{ width: "100%" }}></div>;
}

export default QrCodeScanner;
