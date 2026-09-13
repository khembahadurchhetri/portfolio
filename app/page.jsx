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
import "../styles/portfolio.css";
import "../assets/scenery.css";
export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Ticker />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Journal />
      <SubmissionForm />
      <Resume />
      <Contact />
      <Footer />
      <ChatLauncher />
      <PageScripts kind="home" />
    </>
  );
}

import "../styles/community.css";
