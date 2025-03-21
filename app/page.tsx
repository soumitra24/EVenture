"use client"
import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Hero from "./components/hero";

export default function Home() {


  return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
          
          <Header />
          
          <Hero/>
          
          <Footer />
          
        </div>
  );
}
