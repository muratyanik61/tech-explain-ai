/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fontlar <link> ile calisma aninda yuklenir; build sirasinda Google'a
  // gitmesini istemiyoruz (sunucu fontu indirmeye calismasin).
  optimizeFonts: false,
};

export default nextConfig;
