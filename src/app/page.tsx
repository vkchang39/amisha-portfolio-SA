import { Nav } from "@/components/Nav";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Marquee } from "@/components/Marquee";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Missions } from "@/components/sections/Missions";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <div className="crt-overlay" />
      <div className="grain-overlay" />
      <LoadingScreen />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Missions />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </main>
  );
}
