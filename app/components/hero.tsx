'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const companies = ["Amazon", "Dribbble", "HubSpot", "Notion", "Netflix", "Zoom"];
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return(
        <>
            <div className="flex flex-col md:flex-row items-center justify-between w-full px-[2rem] mt-[5rem]">
                <div className="max-w-lg">
                <h1 className="text-[2.5rem] font-bold mb-[1rem]">Navigating the digital landscape for success</h1>
                <p className="text-gray-600 mb-[1.5rem]">Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.</p>
                <button className="bg-black text-white px-[1.5rem] py-[1rem] rounded-md"
                onClick={() => router.push("/chatbot")}
                >Book a consultation</button>
                </div>
                <div className="mt-[2.5rem] md:mt-0">
                   <img src="./image.png" alt="" className="w-[40rem] mt-[3rem]"/>
                </div>
            </div>
            
            {/* Logo Slideshow */}
            <div className="w-full mt-[3rem] overflow-hidden flex items-center justify-center">
                <div className="flex space-x-[3.5rem] animate-slide text-[1.25rem] font-bold text-gray-800">
                {companies.map((company, index) => (
                    <span key={index} className="uppercase">{company}</span>
                ))}
                </div>
            </div>
            
                {/* Services Section */}
            <section id="services" className="w-full px-[2rem] mt-[5rem] flex-column justify-center items-center">
                <h2 className="text-3xl font-bold mb-6 bg-[#B9FF66] inline-block px-3 py-1 rounded-md">Services</h2>
                <p className="text-gray-600 mb-[2.5rem]">At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] justify-items-center">
                {[
                    { title: "Search engine optimization", color: "bg-[#F3F3F3]" },
                    { title: "Pay-per-click advertising", color: "bg-[#B9FF66]" },
                    { title: "Social Media Marketing", color: "bg-[#191A23] text-white" },
                    { title: "Email Marketing", color: "bg-[#F3F3F3]" },
                    { title: "Content Creation", color: "bg-[#B79FF66]" },
                    { title: "Analytics and Tracking", color: "bg-[#191A23] text-white" },
                ].map((service, index) => (
                    <div key={index} className={`p-[3rem] w-full max-w-[30rem] rounded-4xl shadow-md ${service.color}`}>
                    <h3 className="text-[1.25rem] font-bold mb-[0.75rem]">{service.title}</h3>
                    <p className="text-gray-600">Learn more</p>
                    </div>
                ))}
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="w-full px-10 mt-20">
                <h2 className="text-3xl font-bold mb-6 bg-[#B9FF66] inline-block px-3 py-1 rounded-md">Case Studies</h2>
                <p className="text-gray-600 mb-10">Explore Real-Life Examples of Our Proven Digital Marketing Success through Our Case Studies</p>
                <div className="bg-[#191A23] text-white p-10 rounded-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                    text: "For a local restaurant, we implemented a targeted PPC campaign that resulted in a 50% increase in website traffic and a 25% increase in sales.",
                    },
                    {
                    text: "For a B2B software company, we developed an SEO strategy that resulted in a first-page ranking for key keywords and a 200% increase in organic traffic.",
                    },
                    {
                    text: "For a national retail chain, we created a social media marketing campaign that increased followers by 25% and generated a 20% increase in online sales.",
                    },
                ].map((caseStudy, index) => (
                    <div key={index} className="p-6 border-r border-gray-500 last:border-r-0">
                    <p className="text-gray-300 mb-4">{caseStudy.text}</p>
                    <a href="#" className="text-[#B9FF66] font-bold flex items-center">Learn more →</a>
                    </div>
                ))}
                </div>
            </section>
        </>
    )
}
export default Hero