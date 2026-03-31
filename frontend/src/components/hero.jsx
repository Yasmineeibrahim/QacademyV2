import React from 'react'
import SmoothWavyCanvas from './heroBackground'
import icon1 from '../assets/hero/16.png'
import icon2 from '../assets/hero/17.png'
import icon4 from '../assets/hero/19.png'
import icon5 from '../assets/hero/20.png'
import icon7 from '../assets/hero/22.png'
import icon8 from '../assets/hero/23.png'
import HowItWorks from './How';
import './hero.css'
const Hero = () => {
  return (
    <div
      className="hero-section"
    >
      <SmoothWavyCanvas
        backgroundColor="#fff"
        primaryColor="#0080ff"
        secondaryColor="#0084ff"
        accentColor="#0080ff"
        lineOpacity={2.5}
        animationSpeed={0.004}
      />

      <div className="text-section1">
        <img src={icon1} className="icon1" />
        <img src={icon2} className="icon2" />
        <img src={icon4} className="icon4" />
        <img src={icon5} className="icon5" />
        {/* <img src={icon6} className="icon6" /> */}
        <img src={icon7} className="icon7" />
        <img src={icon8} className="icon8" />
        <h2>YOU'RE NOT A REGULAR HUMAN</h2>
        <h1>
          <span className="hero-line">YOU'RE AN</span>
          <span className="hero-line">ENGINEER!</span>
        </h1>
        <button
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          className="get-started-button"
        >Let's Get Started!</button>
      </div>
    </div>
  )
}

export default Hero