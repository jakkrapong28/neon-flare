"use client";

import { useKnowledgeSystem, Book } from "@/hooks/useKnowledgeSystem";
import { BookOpen, Star, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BooksPage() {
    const { data, addBook, updateBookProgress, deleteBook } = useKnowledgeSystem();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<Partial<Book>>({ title: '', author: '', totalPages: 300, status: 'Not Started' });

    const handleAdd = () => {
        if (form.title) {
            addBook({
                title: form.title!,
                author: form.author || 'Unknown',
                coverColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                status: form.status as any || 'Not Started',
                currentPage: 0,
                totalPages: form.totalPages || 300,
                rating: 0
            });
            setIsOpen(false);
            setForm({ title: '', author: '', totalPages: 300, status: 'Not Started' });
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-amber-500" />
                    ชั้นหนังสือ (Bookshelf)
                </h1>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-amber-600 hover:bg-amber-500 rounded-full">
                            <Plus className="w-5 h-5 mr-1" /> Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>เพิ่มหนังสือใหม่</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ชื่อหนังสือ (Title)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="ผู้แต่ง (Author)" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                            <input type="number" className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" placeholder="จำนวนหน้า (Pages)" value={form.totalPages} onChange={e => setForm({ ...form, totalPages: parseInt(e.target.value) })} />
                            <select className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-white" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                                <option>Not Started</option>
                                <option>Reading</option>
                                <option>Finished</option>
                            </select>
                            <Button onClick={handleAdd} className="w-full bg-amber-600 font-bold">บันทึก</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data.books.map(book => {
                    const progress = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
                    return (
                        <div key={book.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 hover:border-amber-500/50 transition-all">
                            {/* Cover Spine */}
                            <div className="h-48 w-full relative" style={{ backgroundColor: book.coverColor }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md">{book.title}</h3>
                                    <p className="text-white/80 text-xs mt-1">{book.author}</p>
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-bold text-white uppercase">
                                    {book.status}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>{book.currentPage}/{book.totalPages} pages</span>
                                    <span>{progress}%</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex text-amber-500">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-4 h-4 ${s <= book.rating ? 'fill-current' : 'text-zinc-700'}`} />
                                        ))}
                                    </div>
                                    <button onClick={() => deleteBook(book.id)} className="text-zinc-700 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => updateBookProgress(book.id, Math.max(0, book.currentPage - 10))} className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-white">-10p</button>
                                    <button onClick={() => updateBookProgress(book.id, Math.min(book.totalPages, book.currentPage + 10))} className="flex-1 py-1 bg-amber-600/20 hover:bg-amber-600 hover:text-white text-amber-500 rounded text-xs transition-colors">+10p</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.books.length === 0 && <p className="text-center text-zinc-500 py-12">ยังไม่มีหนังสือในชั้น (Empty Bookshelf)</p>}
        </div>
    );
}
