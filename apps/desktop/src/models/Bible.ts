export interface Book {
    id: number;
}

export interface Chapter {
    id: number;
    book: Book;
}

export interface Verse {
    id: number;
    book: Book;
    chapter: Chapter;
}