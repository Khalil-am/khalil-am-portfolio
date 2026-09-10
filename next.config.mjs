/** @type {import('next').NextConfig} */
const legacyBlogRedirects = [
  ["Adaptive-Traffic-Light-System", "adaptive-traffic-light-ai-system"],
  ["BC-Automations", "business-consultant-ai-automations"],
  ["Email_Service", "transactional-email-service"],
  ["Features-Extraction", "medical-image-feature-extraction"],
  ["Hewari-AI-Powered-Document-Builder", "hewari-ai-document-builder"],
  ["KAM-AI", "kam-ai-agent-orchestration"],
  ["KAM-CLI", "kam-cli-developer-tooling"],
  ["Keef-Libsaty", "keef-libsaty-fashion-ai"],
  [
    "New_Role_New_Responsibilties",
    "enterprise-digital-transformation-product-leadership",
  ],
  ["PPlus-AI-Sync-Tool", "pplus-ai-configuration-sync"],
  ["PRF-Production", "prf-production-ai-creative-services"],
  ["SCIC", "supply-chain-intelligence-consultant"],
  ["Virtue_Server", "virtue-ai-mental-health-platform"],
  ["Wajibaty-AI", "wajibaty-ai-visual-study-graphs"],
  ["Wathiq-Fintech-Platform", "wathiq-e-invoicing-platform"],
  ["Yadree", "yadree-ai-business-intelligence"],
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  experimental: {
    globalNotFound: true,
  },
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyBlogRedirects.map(([source, destination]) => ({
      source: `/blog/${source}`,
      destination: `/blog/${destination}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/Khalil_Abu_Mushref_CV.pdf",
        headers: [
          {
            key: "Link",
            value:
              '<https://www.khalil-am.com/Khalil_Abu_Mushref_CV.pdf>; rel="canonical"',
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-snippet:-1",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
