import ChatLauncher from "../components/ChatLauncher";
import Navigation from "../components/portfolio/Navigation";
import Hero from "../components/portfolio/Hero";
import Ticker from "../components/portfolio/Ticker";
import About from "../components/portfolio/About";
import Skills from "../components/portfolio/Skills";
import Experience from "../components/portfolio/Experience";
import Projects from "../components/portfolio/Projects";
import Journal from "../components/portfolio/Journal";
import Resume from "../components/portfolio/Resume";
import Contact from "../components/portfolio/Contact";
import Footer from "../components/portfolio/Footer";
import PageScripts from "../components/PageScripts";
import SubmissionForm from "../components/SubmissionForm";
import AmbientGlow from "../components/portfolio/AmbientGlow";
import "../styles/portfolio.css";
import "../assets/scenery.css";
export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Ticker />
      <div className="portfolio-sections">
        <svg id="scrollRibbon" className="page-ribbon" viewBox="0 0 240 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5275b8" /><stop offset=".5" stopColor="#80cdb9" /><stop offset="1" stopColor="#5275b8" /></linearGradient></defs>
          <path id="ribbonCurve" d="M120 -100 C220 100 20 300 120 500 S220 900 120 1100" fill="none" stroke="url(#flowGradient)" strokeWidth="22" />
          <path id="ribbonHighlight" d="M120 -100 C220 100 20 300 120 500 S220 900 120 1100" fill="none" stroke="#b1eee0" strokeWidth="2" strokeDasharray="100 1400" />
        </svg>
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Journal />
        <SubmissionForm />
        <Resume />
        <Contact />
      </div>
      <Footer />
      <AmbientGlow />
      <ChatLauncher />
      <PageScripts kind="home" />
    </>
  );
}

import "../styles/community.css";
