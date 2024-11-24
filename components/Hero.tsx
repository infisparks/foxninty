import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative h-screen">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          loop
          muted
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Timeless Elegance on Your Wrist
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover our curated collection of premium timepieces
          </p>
          <Link
            href="/collection"
            className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
