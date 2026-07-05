import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = "Khalil Abu Mushref — IT Business Consultant & Product Owner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(49, 43, 130, 0.55) 0%, rgba(3, 7, 18, 0) 55%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              backgroundColor: "#6560a1",
            }}
          />
          <div style={{ color: "#9ca3af", fontSize: "28px" }}>
            www.khalil-am.com
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              color: "#f9fafb",
              fontSize: "88px",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {siteConfig.name}
          </div>
          <div style={{ color: "#c7c9d1", fontSize: "38px" }}>
            IT Business Consultant · Product Owner · AI &amp; BI
          </div>
        </div>
        <div style={{ color: "#6b7280", fontSize: "26px" }}>
          Riyadh, Saudi Arabia
        </div>
      </div>
    ),
    { ...size },
  );
}
