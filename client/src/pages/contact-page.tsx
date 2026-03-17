import React from "react";
import { Mail, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-20">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-50 mb-4">
            <刻录机 className="text-gold-600" size={24} />
          </div>
          <h1 className="text-4xl font-serif italic text-slate-900">Connect with the Studio</h1>
          <p className="text-slate-500 font-light tracking-wide">
            How can we elevate your experience today, gorgeous?
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Support Card */}
          <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group hover:shadow-md transition-all duration-500">
            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                <Mail size={28} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-serif mb-2">Studio Support</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-4">
                  For technical inquiries, account assistance, or design lab feedback.
                </p>
                <a 
                  href="mailto:support@nail-check.com" 
                  className="text-gold-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center md:justify-start gap-2 group-hover:gap-4 transition-all"
                >
                  support@nail-check.com <ArrowRight size={14} />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Card */}
          <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden group hover:shadow-md transition-all duration-500">
            <CardContent className="p-10 flex flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif mb-2">Privacy & Security Suite</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-4">
                  Inquiries regarding your personal data, vault security, or privacy rights.
                </p>
                <a 
                  href="mailto:privacy@nail-check.com" 
                  className="text-slate-900 font-bold tracking-widest text-xs uppercase flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  privacy@nail-check.com <ArrowRight size={14} />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold">
            Nail Check Studio &bull; Est. 2026
          </p>
        </footer>
      </div>
    </div>
  );
}