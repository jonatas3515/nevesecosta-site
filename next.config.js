/** @type {import('next').NextConfig} */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
let supabaseHost = ''
try { supabaseHost = url ? new URL(url).host : '' } catch {}

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'i.im.ge'].concat(supabaseHost ? [supabaseHost] : []),
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.im.ge' },
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
    ],
    unoptimized: false,
  },
}

module.exports = nextConfig
