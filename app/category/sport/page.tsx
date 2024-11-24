import Image from 'next/image';
import Link from 'next/link';

const sportWatches = [
  {
    id: 1,
    name: "Seamaster Professional",
    price: 6500,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Submariner Date",
    price: 15000,
    image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&q=80",
  },
  // Add more sport watches here
];

export default function SportWatchesPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Sport Watches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sportWatches.map((watch) => (
          <Link href={`/product/${watch.id}`} key={watch.id} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={watch.image}
                  alt={watch.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{watch.name}</h2>
                <p className="text-gray-600">${watch.price.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

