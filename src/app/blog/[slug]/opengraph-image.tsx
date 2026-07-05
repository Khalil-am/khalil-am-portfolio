import { getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { ImageResponse } from "next/og";
import path from "path";

export const alt = "Blog post by Khalil Abu Mushref";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const blogDirectory = path.join(process.cwd(), "content");

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(blogDirectory, params.slug);
  const title = post?.metadata.title ?? "Blog";
  const publishedAt = post?.metadata.publishedAt;

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
            "radial-gradient(circle at 15% 85%, rgba(49, 43, 130, 0.55) 0%, rgba(3, 7, 18, 0) 55%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#9ca3af", fontSize: "28px" }}>
          www.khalil-am.com/blog
        </div>
        <div
          style={{
            color: "#f9fafb",
            fontSize: title.length > 60 ? "56px" : "68px",
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#c7c9d1", fontSize: "30px" }}>
            {siteConfig.name}
          </div>
          {publishedAt ? (
            <div style={{ color: "#6b7280", fontSize: "26px" }}>
              {formatDate(publishedAt)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
