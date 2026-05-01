import HeroSlider from '../components/HeroSlider';
import Services from '../components/Services';
import About from '../components/About';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Services />
      <About />
      <Features />
      <Testimonials />
    </>
  );
}
