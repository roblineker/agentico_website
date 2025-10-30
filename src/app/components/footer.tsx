import Link from "next/link";
import Image from "next/image";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container">
        <ScrollAnimation direction="up">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <Image
                src="/images/logo-black.png"
                alt="Agentico"
                width={120}
                height={32}
                className="dark:hidden"
                style={{ height: '2rem', width: 'auto' }}
              />
              <Image
                src="/images/logo-white.png"
                alt="Agentico"
                width={120}
                height={32}
                className="hidden dark:block"
                style={{ height: '2rem', width: 'auto' }}
              />
              <p className="text-sm text-muted-foreground">
                AI-powered automation for small & medium businesses.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    Process Automation
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    Document Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    Custom AI Agents
                  </Link>
                </li>
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                
              <li>
                  <Link href="#industries" className="hover:text-foreground transition-colors">
                    Professional Services
                  </Link>
                </li>
                <li>
                  <Link href="#industries" className="hover:text-foreground transition-colors">
                    Trades & Manufacturing
                  </Link>
                </li>
                <li>
                  <Link href="#industries" className="hover:text-foreground transition-colors">
                    Hospitality & Retail
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link 
                    href="mailto:info@agentico.com.au" 
                    className="hover:text-foreground transition-colors"
                  >
                    info@agentico.com.au
                  </Link>
                </li>
                <li>
                  <Link 
                    href="tel:+61468068882" 
                    className="hover:text-foreground transition-colors"
                  >
                    0468 068 882
                  </Link>
                </li>
                <li>Sunshine Coast, QLD, Australia</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Agentico. All rights reserved.</p>
          </div>
        </ScrollAnimation>
      </div>
    </footer>
  );
}
