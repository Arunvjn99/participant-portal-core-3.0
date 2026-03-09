import React, { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export function Hero() {
  const firstName = "Christopher";
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      try {
        // Check if we have a cached image in localStorage to avoid re-generating on every reload
        const cachedImage = localStorage.getItem('hero_illustration');
        if (cachedImage) {
          setHeroImage(cachedImage);
          setLoading(false);
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          console.error("GEMINI_API_KEY is not set");
          setLoading(false);
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Modern fintech SaaS illustration in isometric 3D style. Three floating 3D gradient cubes arranged at different heights on a soft blue gradient background. Each cube contains a financial dashboard UI card embedded into its surface. Cube 1 (front): A portfolio dashboard card showing a circular asset allocation chart labeled 'Portfolio' with text '72% Stocks'. Cube 2 (left): A smaller financial analytics card showing a donut chart with labels 'Stocks' and 'Bonds'. Cube 3 (top): A large dashboard card showing a financial summary with text 'Good morning, David' and portfolio balance numbers. A minimal vector-style character is sitting on the top cube, looking at a smartphone or tablet, interacting with the financial dashboard. Style: isometric perspective, modern fintech product marketing illustration, floating UI cards integrated into 3D blocks, smooth gradient lighting, soft long shadows, minimal vector character design, clean SaaS dashboard interface elements, blue and teal fintech color palette. Inspired by Stripe and Betterment.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64Data}`;
            setHeroImage(imageUrl);
            try {
              localStorage.setItem('hero_illustration', imageUrl);
            } catch (e) {
              console.warn("Could not save image to localStorage (quota exceeded?)");
            }
            break;
          }
        }
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 items-center">
      {/* Left Column: Content & CTA */}
      <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm text-emerald-700 shadow-sm w-fit mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Enrollment open until Oct 31
          </div>
          
          <div className="space-y-0">
            <p className="text-xl font-medium text-gray-500">Welcome back,</p>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              {firstName}
            </h1>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-400 pt-2">
            Start building your retirement today.
          </h2>
          
          <p className="max-w-xl text-lg text-gray-600 leading-relaxed pt-4">
            Your company offers a retirement plan to help you grow long-term savings. 
            Enrollment takes about 4 minutes.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <Button size="lg" variant="accent" className="text-lg px-8 h-14 shadow-lg shadow-emerald-600/20 w-full sm:w-auto">
            Start Enrollment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto">
            How the plan works
          </Button>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-gray-400 flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Most employees complete enrollment in under 4 minutes.
        </motion.p>
      </div>

      {/* Right Column: Modern Fintech 3D Illustration */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="lg:col-span-6 relative h-[500px] w-full flex items-center justify-center perspective-1000"
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-3xl animate-pulse">
            <div className="text-gray-400 font-medium">Generating illustration...</div>
          </div>
        ) : heroImage ? (
          <img 
            src={heroImage} 
            alt="Fintech Dashboard Illustration" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-3xl">
            <div className="text-gray-400 font-medium">Illustration unavailable</div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
