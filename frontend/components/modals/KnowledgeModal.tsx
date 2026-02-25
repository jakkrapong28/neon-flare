"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, Link as LinkIcon, FileText } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface KnowledgeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function KnowledgeModal({ isOpen, onClose }: KnowledgeModalProps) {
    const t = useTranslations('Knowledge');
    const tCommon = useTranslations('Common');
    const [activeTab, setActiveTab] = useState("note");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        setLoading(true);
        try {
            await axios.post("http://localhost:3005/api/knowledge", {
                title,
                type: activeTab,
                content: activeTab === 'note' ? content : undefined,
                url: activeTab === 'link' ? url : undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(tCommon('save') + " " + tCommon('confirm'));
            router.refresh();
            onClose();
            setTitle(""); setContent(""); setUrl("");
        } catch (error) {
            console.error("Failed to save knowledge", error);
            alert(tCommon('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-cyan-400">
                        <Book className="h-5 w-5" />
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="note" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                        <TabsTrigger value="note"><FileText className="w-4 h-4 mr-2" /> {t('add_note')}</TabsTrigger>
                        <TabsTrigger value="link"><LinkIcon className="w-4 h-4 mr-2" /> {t('add_link')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="note" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input placeholder={t('note_title')} className="bg-zinc-900 border-zinc-800" value={title} onChange={e => setTitle(e.target.value)} />
                            <textarea
                                className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                placeholder={t('note_content')}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input placeholder={t('note_title')} className="bg-zinc-900 border-zinc-800" value={title} onChange={e => setTitle(e.target.value)} />
                            <Input placeholder={t('link_url')} className="bg-zinc-900 border-zinc-800" value={url} onChange={e => setUrl(e.target.value)} />
                            <p className="text-xs text-zinc-500">* AI will try to summarize content from this link automatically.</p>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>{tCommon('cancel')}</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                        {loading ? tCommon('loading') : t('save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
