import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@omnisite/ui", "@omnisite/types", "@omnisite/utils"]
};

export default nextConfig;