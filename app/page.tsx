import Box from '@mui/material/Box';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import StepSection from './components/StepSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <Box component="main">
      <Header />
      <HeroSection />
      <FeatureSection />
      <StepSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </Box>
  );
}
