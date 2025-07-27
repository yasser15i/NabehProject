import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Brain, Menu } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { href: "#", label: "الرئيسية" },
    { href: "#study", label: "ابدأ المذاكرة" },
    { href: "#tasks", label: "مهامي" },
    { href: "#sounds", label: "الأصوات" },
    { href: "#achievements", label: "لوحة التحفيز" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-primary">نبيه</h1>
          </div>
          
          <div className="hidden md:flex space-x-reverse space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-warm-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center">
            <Button 
              className="bg-secondary text-warm-gray-800 hover:bg-secondary-dark ml-3"
            >
              حسابي
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-warm-gray-600 hover:text-primary transition-colors text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
