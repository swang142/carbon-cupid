import { ArrowRight, Target, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                <span className="text-primary">Connect</span> with the right 
                <span className="text-primary"> fundees</span> today
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 animate-slide-up" style={{ animationDelay: "200ms" }}>
                Streamline your funding process and discover promising opportunities with our intuitive platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
                <Link href="/fundees" className="inline-flex items-center gap-2 bg-primary text-white py-2 px-6 rounded-lg text-lg hover:bg-primary/80 transition-colors">
                  Explore Fundees
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 border border-primary text-primary py-2 px-6 rounded-lg text-lg hover:bg-primary/10 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="flex-1 mt-8 md:mt-0 animate-scale-in" style={{ animationDelay: "400ms" }}>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Platform showcase" 
                className="rounded-lg shadow-xl"
                width={640}
                height={427}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CarbonCupid?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers unique advantages for connecting funders with the right opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precision Matching</h3>
              <p className="text-muted-foreground">Our advanced algorithms connect you with fundees that match your specific investment criteria.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Network</h3>
              <p className="text-muted-foreground">Access a worldwide community of fundees and opportunities previously out of reach.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
              <p className="text-muted-foreground">Every profile on our platform is thoroughly vetted to ensure quality and trustworthiness.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your next opportunity?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of funders who have already discovered promising fundees through our platform.
            </p>
            <Link href="/fundees" className="inline-flex items-center gap-2 bg-primary text-white py-2 px-6 rounded-lg text-lg hover:bg-primary/80 transition-colors">
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xl font-semibold">
              <span className="text-primary">fundee</span>
              <span>connect</span>
            </div>
            
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} CarbonCupid. All rights reserved.
            </div>
            
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
