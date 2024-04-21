
import { HeroSection } from '@/features/home';
import { IntroScrollMouse } from "@/components/intro-scroll-mouse";

export default function Page(){
    return (
      <div className="h-[calc(100vh-64px)] grid relative place-content-center">
        <HeroSection />
        <div className="grid place-content-center absolute bottom-8 md:bottom-12 inset-x-0">
          <IntroScrollMouse />
        </div>
      </div>
    );
}