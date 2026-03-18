import ProductConfigurator from '@/components/ProductConfigurator';
import { sofaProductData } from '@/lib/sofa-data';

export const metadata = {
  title: '豪华沙发 | Visual Product Configurator',
  description: '定制您的专属豪华沙发，选择框架、靠垫和靠背材质',
};

export default function SofaPage() {
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
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">首页</a>
            <a href="/sofa" className="text-gray-900 font-semibold hover:text-gray-900 transition-colors">沙发</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Catalog</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Contact Us
            </button>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">首页</a>
          <span>/</span>
          <span className="text-gray-900">豪华沙发</span>
        </nav>
      </div>

      {/* Product Configurator */}
      <ProductConfigurator
        productName={sofaProductData.productName}
        basePrice={sofaProductData.basePrice}
        options={sofaProductData.options}
      />

      {/* Product Description */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">产品详情</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {sofaProductData.description || '精选高品质材料，打造舒适奢华的居家体验'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">优质框架</h3>
                <p className="text-sm text-gray-600">实木框架，稳固耐用</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">舒适靠垫</h3>
                <p className="text-sm text-gray-600">高密度海绵，久坐不塌</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">品质保证</h3>
                <p className="text-sm text-gray-600">2年质保，终身维护</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <li><a href="/sofa" className="hover:text-gray-900">Sofas</a></li>
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
