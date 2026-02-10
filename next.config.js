/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'img.rocket.new', 
      'i.pravatar.cc',
      'res.cloudinary.com'  // ← ADD THIS!
    ],
    unoptimized: true
  }
}

module.exports = nextConfig