"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Book, ExternalLink } from "lucide-react";
import { PrivacyBlur } from "@/components/ui/PrivacyBlur";
import { KnowledgeModal } from "@/components/modals/KnowledgeModal"; // Need to create this
import axios from "axios";
import { useTranslations } from "next-intl";

export default function KnowledgePage() {
    const t = useTranslations('Knowledge');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            try {
                const res = await axios.get("http://localhost:3005/api/knowledge", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setItems(res.data);
            } catch (error) {
                console.error("Failed to fetch knowledge items", error);
            }
        };
        fetchItems();
    }, [isModalOpen]); // Refresh when modal closes (and potentially saves)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-zinc-400">{t('description')}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> {t('add_note')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item: any) => (
                    <div key={item._id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/50 hover:border-cyan-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 uppercase">{item.type}</span>
                        </div>

                        <PrivacyBlur>
                            <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
                                {item.content || item.summary || "No content"}
                            </p>
                        </PrivacyBlur>

                        {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-500 flex items-center hover:underline">
                                <ExternalLink className="w-3 h-3 mr-1" /> Open Link
                            </a>
                        )}
                    </div>
                ))}
            </div>

            <KnowledgeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
