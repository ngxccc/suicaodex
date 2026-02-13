"use client";

import { useEffect } from "react";
import { initImageProxy } from "@/shared/config/axios";

export function ImageProxyInitializer() {
  useEffect(() => {
    initImageProxy();

    // Refresh proxy
    const interval = setInterval(
      () => {
        initImageProxy();
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
