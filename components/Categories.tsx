import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    name: "Luxury Watches",
    description: "Timeless elegance and sophistication",
    image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&q=80",
    link: "/category/luxury"
  },
  {
    name: "Sport Watches",
    description: "Durability meets performance",
    image: "https://images.unsplash.com/photo-1623998022290-a74f8cc36563?auto=format&fit=crop&q=80",
    link: "/category/sport"
  },
  {
    name: "Smart Watches",
    description: "Technology on your wrist",
    image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&q=80",
    link: "/category/smart"
  },
  {
    name: "Vintage Watches",
    description: "Classic timepieces with history",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80",
    link: "/category/vintage"
  },
];

export default function Categories() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              href={category.link}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
            >
              <div className="relative h-80">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

