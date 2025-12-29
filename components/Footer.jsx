import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-4">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            no<span className="text-[#c2c5ca]">Trainer</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Empowering your fitness journey with AI-driven workouts and
            analytics. Train smarter, not harder.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:text-white transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="#workouts" className="hover:text-white transition">
                Workouts
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white hover:text-black transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white hover:text-black transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white hover:text-black transition"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:support@notrainer.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white hover:text-black transition"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {currentYear} noTrainer. All rights reserved.</p>
        <p>Built for strength.</p>
      </div>
    </footer>
  );
}

export default Footer;
