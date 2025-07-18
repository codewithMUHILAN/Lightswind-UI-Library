import React from 'react';

const ShopProductCards = () => {
  // Sample JSON data for products
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 299.99,
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Experience true wireless freedom with premium sound quality. Noise-cancelling technology for the best listening experience.",
      rating: 4.5,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 149.99,
      image: "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Stay connected and track your fitness goals with a sleek, stylish smartwatch that blends functionality and elegance.",
      rating: 4.0,
      category: "Wearables"
    },
    {
      id: 3,
      name: "Bluetooth Tws",
      price: 129.99,
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Portable and powerful sound system with deep bass and crystal-clear highs. Perfect for parties and outdoor events.",
      rating: 3.8,
      category: "Audio"
    },
    {
      id: 4,
      name: "4K UHD Smart TV",
      price: 799.99,
      image: "https://images.pexels.com/photos/28549934/pexels-photo-28549934/free-photo-of-modern-home-living-room-with-smart-devices.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Enjoy your favorite content in stunning 4K resolution with vibrant colors and dynamic sound. Perfect for home entertainment.",
      rating: 4.7,
      category: "Electronics"
    }
  ];

  // Function to generate product cards
  const renderProductCards = () => {
    return products.map((product) => (
      <div
        key={product.id}
        className="product-card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:translate-y-[-10px] hover:shadow-xl"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mt-4">{product.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center text-xs md:text-base mt-2">{product.description}</p>
        <div className="flex items-center mt-4">
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            '$'{product.price.toFixed(2)}
          </span>
          <span className="ml-2 text-yellow-500">
            {'★'.repeat(Math.floor(product.rating))}
            <span className="text-gray-400 dark:text-gray-500">
              {'★'.repeat(5 - Math.floor(product.rating))}
            </span>
          </span>
        </div>
        <div className="mt-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">{product.category}</div>
        <button className="text-sm md:text-lg flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 md:w-6 h-5 md:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Add to Cart
        </button>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-primarylw bg-white dark:bg-gray-900">
      <h1 className="text-2xl md:text-4xl  font-extrabold text-gray-800 dark:text-white">Our Premium Products</h1>
      <p className="mt-2 text-sm md:text-lg text-gray-600 dark:text-gray-300">
        Explore our collection of top-quality products designed to enhance your lifestyle.
      </p>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-8">
        {renderProductCards()}
      </div>
    </div>
  );
};

export default ShopProductCards;