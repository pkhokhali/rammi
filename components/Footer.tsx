import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary-400" fill="currentColor" />
              <span className="text-xl font-bold">HealthFit</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted partner in health, diet, and fitness. Transform your lifestyle with expert guidance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/diet" className="hover:text-white transition">Diet & Nutrition</Link></li>
              <li><Link href="/fitness" className="hover:text-white transition">Fitness & Workouts</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/chat" className="hover:text-white transition">AI Health Assistant</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Health Articles</Link></li>
              <li><Link href="/fitness" className="hover:text-white transition">Workout Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} HealthFit. All rights reserved.</p>
          <p className="mt-2">This website provides general health information only. Consult a healthcare professional for medical advice.</p>
        </div>
      </div>
    </footer>
  );
}

