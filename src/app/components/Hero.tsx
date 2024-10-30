import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 lg:px-8">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="font-poppins text-4xl lg:text-7xl font-extrabold text-green-800 leading-tight mb-4 tracking-wide">
            Discover Your Next Favorite Book
          </h1>
          <p className="font-cinzel text-lg lg:text-2xl text-green-700 mb-6">
  Dive into a world of books with endless possibilities. Browse our collection and find your next adventure!
</p>

          <div className="flex justify-center md:justify-start">
            <a href="#explore-books" className="bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-800 transition-all duration-300 mr-4 shadow-md hover:shadow-lg">
              Browse Books
            </a>
            <a href="#featured" className="bg-white text-green-700 border-2 border-green-700 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg">
              Get Started
            </a>
          </div>
        </div>
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/ab.webp" // Ensure you have this image in your public folder
            alt="Light Green Theme Hero Image"
            width={500} // Increased width for better visual impact
            height={500} // Adjust height to maintain aspect ratio
            className="rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection;




