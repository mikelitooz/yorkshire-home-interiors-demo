import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { business, media, stats } from "@/data/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="absolute inset-0">
        <Image
          src={media.hero}
          alt="Elegant living room furniture showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 pb-8 pt-24 lg:grid-cols-[1.05fr_0.7fr] lg:items-end">
          <Reveal>
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Star className="h-4 w-4 fill-bronze text-bronze" />
                {business.rating} rated Sheffield furniture showroom
              </div>
              <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.9] text-balance md:text-8xl">
                Beautiful furniture for homes that feel complete.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-pretty text-ivory/80">
                Sofas, beds, wardrobes, dining sets, carpets and home essentials from a local Queens Road showroom
                with friendly advice, delivery and assembly support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/shop" variant="light">
                  Explore collection
                </Button>
                <Button href="/contact" variant="ghost" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Visit showroom
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-smoke">Today in showroom</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl bg-white/10 p-5">
                    <p className="font-display text-3xl font-semibold">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-ivory/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
