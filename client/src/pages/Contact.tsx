import { Mail, Shield, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const PINK_GRADIENT = "bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B]";
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D]";

export default function Contact() {
  return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif tracking-widest uppercase bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00D9FF] bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg">
            We're here to help with any questions about your Nail Check experience
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Support Email */}
          <div className="bg-gradient-to-br from-white to-[#FFF5F8] rounded-3xl p-8 border border-[#FF6B9D]/20 hover:shadow-xl hover:shadow-[#FF6B9D]/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B9D] to-[#FF8A5B] rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-serif mb-3 text-gray-800">Customer Support</h2>
            <p className="text-gray-600 mb-6">
              Questions about your account, features, or need technical help? We're here for you.
            </p>
            <a 
              href="mailto:support@nail-check.com" 
              className="inline-flex items-center gap-2 text-[#FF6B9D] font-medium hover:text-[#9B5DE5] transition-colors"
            >
              <Mail className="h-5 w-5" />
              support@nail-check.com
            </a>
          </div>

          {/* Privacy Email */}
          <div className="bg-gradient-to-br from-white to-[#F8F0FF] rounded-3xl p-8 border border-[#9B5DE5]/20 hover:shadow-xl hover:shadow-[#9B5DE5]/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-serif mb-3 text-gray-800">Privacy & Security</h2>
            <p className="text-gray-600 mb-6">
              Questions about data privacy, security, or account deletion? Contact our privacy team.
            </p>
            <a 
              href="mailto:privacy@nail-check.com" 
              className="inline-flex items-center gap-2 text-[#9B5DE5] font-medium hover:text-[#FF6B9D] transition-colors"
            >
              <Mail className="h-5 w-5" />
              privacy@nail-check.com
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-[#FFF5F8] via-[#F8F0FF] to-[#F0FFFF] rounded-3xl p-8 border-2 border-dashed border-[#FF6B9D]/30">
          <h3 className="text-xl font-serif mb-6 text-center">Looking for something else?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="/tutorials" className="group">
              <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-all text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#FF6B9D] transition-colors">
                  Tutorials & Guides
                </p>
              </div>
            </a>
            <a href="/about" className="group">
              <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-all text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#9B5DE5] to-[#00D9FF] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💡</span>
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#9B5DE5] transition-colors">
                  About Nail Check
                </p>
              </div>
            </a>
            <a href="/membership" className="group">
              <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-all text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00D9FF] to-[#FF6B9D] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👑</span>
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#00D9FF] transition-colors">
                  Membership Info
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            We typically respond within 24-48 hours during business days
          </p>
        </div>
      </div>
  );
}