import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20property%20consultation%20in%20Nagpur"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-success px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
  >
    <MessageCircle className="w-5 h-5 text-primary-foreground" />
    <span className="text-primary-foreground font-semibold text-sm hidden sm:inline">Talk to Expert</span>
  </a>
);

export default WhatsAppButton;
