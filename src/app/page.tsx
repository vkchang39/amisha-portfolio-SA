import { Nav } from "@/components/Nav";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GameUiLayer } from "@/components/GameUiLayer";
import { MotionGatedOverlays } from "@/components/MotionGatedOverlays";
import { Marquee } from "@/components/Marquee";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Missions } from "@/components/sections/Missions";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <GameUiLayer>
        <main id="main-content" className="relative">
          <MotionGatedOverlays />
          <LoadingScreen />
          <Nav />
          <Hero />
          <Marquee />
          <About />
          <Missions />
          <Projects />
          <Skills />
          <Education />
          <Contact year={year} />
        </main>
      </GameUiLayer>
    </>
  );
}
