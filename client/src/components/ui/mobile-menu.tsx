import { useState } from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  links: Array<{ href: string; label: string }>;
  ctaHref: string;
  ctaLabel: string;
}

export function MobileMenu({ links, ctaHref, ctaLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    closeMenu();
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden text-foreground hover:text-primary p-2"
        data-testid="button-mobile-menu"
      >
        <span className="sr-only">Open menu</span>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors duration-200"
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection(ctaHref)}
              className="block mx-3 mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors duration-200 w-[calc(100%-1.5rem)]"
              data-testid="button-get-started-mobile"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
