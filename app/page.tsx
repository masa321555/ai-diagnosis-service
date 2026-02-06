import Box from '@mui/material/Box';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import StepSection from './components/StepSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <Box component="main">
      <HeroSection />
      <FeatureSection />
      <StepSection />
      <CTASection />
      <Footer />
    </Box>
  );
}
