"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    try {
      // @ts-expect-error adsbygoogle no tiene tipos
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // no-op
    }
  }, []);

  return (
    <div className="w-full flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minWidth: "300px",
          height: "250px",
        }}
        data-ad-client="ca-pub-5063066587377461"
        data-ad-slot="5460988193"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
