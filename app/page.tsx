import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import Categories from '@/components/Categories'
import BrandShowcase from '@/components/BrandShowcase'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Categories />
      <BrandShowcase />
      <Footer />
    </main>
  )
}

