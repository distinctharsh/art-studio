"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Intro Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-28">
          {/* Left Panel: Image */}
          <div className="lg:col-span-5 relative aspect-[4/5] w-full bg-zinc-900 rounded-lg overflow-hidden border border-white/[0.03] shadow-xl">
            <Image
              src="/images/studio_hero.png"
              alt="Artist Surbhi working in her studio"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Panel: Biography */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-medium">
              The Artist
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-zinc-100 leading-tight">
              Surbhi, <span className="italic font-normal text-accent font-serif">behind the brush</span>.
            </h1>

            <div className="w-16 h-[1px] bg-accent/40 my-2" />

            <div className="flex flex-col gap-4 text-sm text-zinc-400 font-serif leading-relaxed italic">
              <p>
                Based in Mumbai, India, Surbhi creates deeply layered abstract paintings that explore themes of memory, space, and the quiet moments between things. Her work is a study in texture, light, and organic forms.
              </p>
              <p>
                Surbhi believes that art should be a slow process. Rather than rushing to complete a piece, she spends weeks building up layers of raw gesso, sand, and pigment on canvas. This layered approach creates a physical depth that invites viewers to touch the painting with their eyes.
              </p>
              <p>
                "My work is a trace of presence," Surbhi says. "Each brushstroke, mark, and scratch represents a specific moment in time. When someone takes a painting home, they are taking a physical record of those silent moments."
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy & Process Section */}
        <div className="bg-[#050505] border border-white/[0.02] p-8 md:p-16 rounded-xl mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] text-zinc-500 uppercase font-medium mb-3 block">
              Our Practice
            </span>
            <h2 className="font-serif text-3xl font-light text-zinc-100">
              The Creative Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Principle 1 */}
            <div className="flex flex-col gap-4">
              <div className="font-serif text-3xl text-accent/40 font-light">01</div>
              <h3 className="font-serif text-lg font-light text-zinc-200">
                Layered Tactility
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500 font-sans">
                Each painting undergoes a rigorous process of layering. Surbhi mixes sand, marble dust, and plaster with acrylic binders to build tactile, organic surfaces that capture light and shadow dynamically.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="flex flex-col gap-4">
              <div className="font-serif text-3xl text-accent/40 font-light">02</div>
              <h3 className="font-serif text-lg font-light text-zinc-200">
                Honoring Materials
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500 font-sans">
                From organic ochre pigments sourced locally to hand-stretched raw canvas and sheets of gold or copper foil, every material is selected for its natural character and longevity.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="flex flex-col gap-4">
              <div className="font-serif text-3xl text-accent/40 font-light">03</div>
              <h3 className="font-serif text-lg font-light text-zinc-200">
                Singular Existence
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500 font-sans">
                In a world of mass reproduction, we believe in the sacredness of the original. We do not sell prints or giclées. Every painting is a singular, physical artifact that can never be replicated.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center flex flex-col items-center gap-6 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl font-light text-zinc-100">
            Explore Surbhi's work
          </h3>
          <p className="text-zinc-500 text-xs font-sans leading-relaxed">
            See the available paintings from our current collection, or reach out to Surbhi directly to discuss commissions and artwork details.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="/gallery"
              className="py-3 px-6 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-semibold tracking-widest uppercase rounded transition-all duration-300"
            >
              View Gallery
            </Link>
            <Link
              href="/contact"
              className="py-3 px-6 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold tracking-widest uppercase rounded transition-all duration-300"
            >
              Contact Surbhi
            </Link>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex gap-6 mt-8">
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
