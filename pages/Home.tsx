import React from 'react';
import Hero from '../components/Hero';
import StarFields from '../components/StarFields';
import RedSoul from '../components/RedSoul';
import IndustryView from '../components/IndustryView';
import SpiritSource from '../components/SpiritSource';
import PlatformLinks from '../components/PlatformLinks';
import AiTutor from '../components/AiTutor';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <StarFields />
      <RedSoul />
      <IndustryView />
      <SpiritSource />
      <AiTutor />
      <PlatformLinks />
    </>
  );
};

export default Home;