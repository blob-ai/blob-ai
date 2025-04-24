
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">inspire.me</h3>
            <p className="text-white/60 max-w-md">
              AI-powered content creation for today's creators.
            </p>
            <p className="mt-2 text-white/60">
              Used by 10,000+ content creators
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="text-white/60 hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/60 hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-primary-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-white/60 hover:text-primary-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60">© 2025 Inspire.me. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
