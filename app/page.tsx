import ProductConfigurator from '@/components/ProductConfigurator';
import { mockProductData } from '@/lib/mock-data';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Product Configurator</h1>
              <p className="text-xs text-gray-500">Interactive 3D Preview</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Products</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Catalog</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Contact Us
            </button>
          </nav>
        </div>
      </header>

      {/* Product Configurator */}
      <ProductConfigurator
        productName={mockProductData.productName}
        basePrice={mockProductData.basePrice}
        options={mockProductData.options}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-sm text-gray-600">
                Premium seating solutions for commercial and residential spaces.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Sofas</a></li>
                <li><a href="#" className="hover:text-gray-900">Chairs</a></li>
                <li><a href="#" className="hover:text-gray-900">Tables</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-900">Shipping</a></li>
                <li><a href="#" className="hover:text-gray-900">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>support@example.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2024 Visual Product Configurator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
