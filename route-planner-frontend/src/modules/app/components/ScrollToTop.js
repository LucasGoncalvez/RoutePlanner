import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ children }) {
    const ScreenRef = useRef(null);
    const { pathname } = useLocation();
    const executeScroll = () =>
        ScreenRef.current.scrollIntoView({ behavior: "auto" });

    useEffect(() => {
        executeScroll();
    }, [pathname]);

    return <div ref={ScreenRef}>{children}</div>;
}