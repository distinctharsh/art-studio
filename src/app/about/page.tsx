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
            See the available paintings from our current collection, or reach out to Surbhi directly to schedule a private studio visit in Mumbai.
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
        </div>
      </main>

      <Footer />
    </>
  );
}
