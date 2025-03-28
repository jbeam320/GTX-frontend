"use client";

import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "../hooks";
import { useEffect, useState } from "react";

const PrivateGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { walletAddress } = useWallet();
    const [isInitialized, setIsInitialized] = useState(false);
    
    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            return;
        }

        if (isInitialized && !walletAddress && pathname !== '/') {
            router.replace("/");
        }
    }, [walletAddress, router, pathname, isInitialized]);
    
    // Don't render anything until we've done initial wallet check
    if (!isInitialized) {
        return null;
    }

    // After initialization, allow access to home or if wallet is connected
    if (pathname === '/' || walletAddress) {
        return children;
    }
    
    return null;
};

export default PrivateGuard;
