"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";

export const TypeIntro = () => {
  return (
    <TypeAnimation
      className="text-2xl md:text-5xl tracking-widest"
      sequence={[500, "一名炒股大师。金融高手", 1000,"只搞技术会完蛋的",1000]}
      speed={10}
      repeat={Infinity}
    />
  );
};
