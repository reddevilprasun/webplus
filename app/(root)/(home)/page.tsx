import React from "react";
import { Hero } from "./components/hero";
import { Features } from "./components/feature";
import { Services } from "./components/services";
import { Pricing } from "./components/priceing";
import { Goals } from "./components/goals";
import { Footer } from "./components/footer";

const Home = async () => {
  return (
    <div className="min-h-screen space-y-0 bg-[#1E2656]">
      <div className='bg-[url("/images/webplus-bg.jpg")] bg-cover bg-center w-full flex items-center justify-center'>
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900/80 to-gray-900/60">
        <Hero/>
        </div>
      </div>
        <Features/>
        <Services/>
        <Pricing/>
        <Goals/>
        <Footer/>
    </div>
  );
};

export default Home;
