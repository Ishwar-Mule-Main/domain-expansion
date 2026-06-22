"use client";

import dynamic from "next/dynamic";

const ServiceCanvas = dynamic(
  () => import("./ServiceCanvas"),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#0D0D0D]" /> }
);

interface ServiceVisualProps {
  slug: string;
}

export function ServiceVisual({ slug }: ServiceVisualProps) {
  return <ServiceCanvas slug={slug} />;
}
