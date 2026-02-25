import { useState, useEffect } from 'react';

export interface Book {
    id: string;
    title: string;
    author: string;
    coverColor: string;
    status: 'Not Started' | 'Reading' | 'Finished';
    currentPage: number;
    totalPages: number;
    rating: number; // 0-5
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    progress: number; // 0-100
}

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
}

export interface KnowledgeData {
    books: Book[];
    flashcards: Flashcard[];
    courses: Course[];
    notes: Note[];
}

const INITIAL_DATA: KnowledgeData = {
    books: [],
    flashcards: [],
    courses: [],
    notes: []
};

const STORAGE_KEY = 'neon_knowledge_core';

export function useKnowledgeSystem() {
    const [data, setData] = useState<KnowledgeData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setData(JSON.parse(stored));
                } catch (e) { console.error("Knowledge Data Parse Error", e); }
            }
        }
    }, []);

    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, mounted]);

    // --- Actions ---

    // Books
    const addBook = (book: Omit<Book, 'id'>) => {
        setData(prev => ({ ...prev, books: [...prev.books, { ...book, id: Date.now().toString() }] }));
    };

    const updateBookProgress = (id: string, page: number) => {
        setData(prev => ({
            ...prev,
            books: prev.books.map(b => b.id === id ? { ...b, currentPage: page } : b)
        }));
    };

    const rateBook = (id: string, rating: number) => {
        setData(prev => ({
            ...prev,
            books: prev.books.map(b => b.id === id ? { ...b, rating } : b)
        }));
    };

    const deleteBook = (id: string) => {
        setData(prev => ({ ...prev, books: prev.books.filter(b => b.id !== id) }));
    };

    // Flashcards
    const addCard = (front: string, back: string) => {
        setData(prev => ({ ...prev, flashcards: [...prev.flashcards, { id: Date.now().toString(), front, back }] }));
    };

    const deleteCard = (id: string) => {
        setData(prev => ({ ...prev, flashcards: prev.flashcards.filter(c => c.id !== id) }));
    };

    // Courses
    const addCourse = (course: Omit<Course, 'id' | 'progress'>) => {
        setData(prev => ({ ...prev, courses: [...prev.courses, { ...course, id: Date.now().toString(), progress: 0 }] }));
    };

    const updateCourseProgress = (id: string, progress: number) => {
        setData(prev => ({ ...prev, courses: prev.courses.map(c => c.id === id ? { ...c, progress } : c) }));
    };

    const deleteCourse = (id: string) => {
        setData(prev => ({ ...prev, courses: prev.courses.filter(c => c.id !== id) }));
    };

    // Notes
    const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
        setData(prev => ({ ...prev, notes: [...prev.notes, { ...note, id: Date.now().toString(), createdAt: new Date().toISOString() }] }));
    };

    const deleteNote = (id: string) => {
        setData(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
    };

    return {
        data, mounted,
        addBook, updateBookProgress, rateBook, deleteBook,
        addCard, deleteCard,
        addCourse, updateCourseProgress, deleteCourse,
        addNote, deleteNote
    };
}
