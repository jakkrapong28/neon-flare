"use client";

import { Quote, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const QUOTES = [
    "ความล้มเหลวไม่ใช่ทางตรงกันข้ามกับความสำเร็จ แต่เป็นส่วนหนึ่งของความสำเร็จ",
    "อย่ารอให้พร้อม เพราะคุณไม่มีวันพร้อม 100%",
    "วินัย คือการทำสิ่งที่ต้องทำ แม้ในวันที่ไม่อยากทำ",
    "ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น",
    "The only way to do great work is to love what you do.",
    "ชีวิตไม่ได้วัดกันที่ลมหายใจเข้าออก แต่วัดที่ช่วงเวลาที่เราแทบหยุดหายใจ",
    "ลงทุนกับความรู้ ให้ผลตอบแทนดีที่สุด",
    "อย่าเปรียบเทียบชีวิตบทที่ 1 ของคุณ กับบทที่ 20 ของคนอื่น",
    "วันนี้คือโอกาสเดียวที่คุณจะมีวันนี้",
    "จงกล้าที่จะฝัน และกล้าที่จะลงมือทำ"
];

export default function QuotesPage() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const randomize = () => {
        setFade(false);
        setTimeout(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * QUOTES.length);
            } while (nextIndex === index);
            setIndex(nextIndex);
            setFade(true);
        }, 300);
    };

    useEffect(() => {
        randomize();
    }, []);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-black pointer-events-none" />

            <Quote className="w-24 h-24 text-indigo-500/20 absolute top-1/4 left-1/4" />

            <div className={`relative z-10 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400 leading-tight max-w-4xl mx-auto drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                    "{QUOTES[index]}"
                </h1>
            </div>

            <Button onClick={randomize} className="mt-16 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold rounded-full px-8 py-6 text-lg">
                <RefreshCw className="w-5 h-5 mr-3" />
                Random Quote
            </Button>
        </div>
    );
}
