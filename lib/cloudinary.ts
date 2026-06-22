interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams) {
  // If the src is a fully qualified URL not hosted on Cloudinary, return it directly
  if (src.startsWith("http") && !src.includes("cloudinary.com")) {
    return src;
  }

  // Remove the domain path prefix if a complete Cloudinary image link was supplied
  // format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>
  const cleanSrc = src.replace(/https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/([^/]+\/)?/, "");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "mock_cloud";
  
  // Apply standard auto format (WebP/AVIF), limiting boundaries, dimensions, and compression quality
  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality || 75}`,
  ].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanSrc}`;
}
