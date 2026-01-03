"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  Database, 
  MessageSquare, 
  Columns3, 
  Gamepad2, 
  Wand2, 
  UserCircle, 
  Calculator, 
  Trophy 
} from "lucide-react";

const Features = () => {
  const features = [
    { icon: <UserCircle size={24} />, title: "Muscle Mapping", desc: "SVG selection for visual targeting." },
    { icon: <Wand2 size={24} />, title: "Workout Wizard", desc: "Custom plans based on your gear." },
    { icon: <Camera size={24} />, title: "Visual Guides", desc: "Photo references and postures." },
    { icon: <Database size={24} />, title: "Rich Dataset", desc: "Detailed names and exercise info." },
    { icon: <Columns3 size={24} />, title: "Kanban Board", desc: "Productivity and organizing tools ." },
    { icon: <MessageSquare size={24} />, title: "24/7 Chatbot Support", desc: "AI chatbot trainer always online." },
    { icon: <Gamepad2 size={24} />, title: "Relaxing Game", desc: "Interactive challenges and rewards." },
    { icon: <Calculator size={24} />, title: "Calculators", desc: "Health and macro metrics." },
  ];

  return (
    <section className="bg-black text-white py-16 px-6 md:px-20 border-t-4 border-yellow-400">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            Features
          </h2>
          <div className="h-1.5 w-16 bg-yellow-400 mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, x: 4 }}
              className="bg-yellow-400 text-black p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[8px_8px_0px_0px_#22c55e] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-black text-yellow-400 p-2 border-2 border-black shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase leading-tight mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[12px] font-bold uppercase leading-tight opacity-80 border-t border-black/20 pt-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;