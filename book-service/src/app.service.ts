import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  private books = [
    { id: 1, title: 'Clean Code' },
    { id: 2, title: 'Domain-Driven Design' },
  ];

  findAll() {
    return this.books;
  }

  create(createBookDto: CreateBookDto) {
    const newBook = { id: Date.now(), ...createBookDto };
    this.books.push(newBook);
    return newBook;
  }

  findOne(id: string) {
    return this.books.find(book => book.id === +id);
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    const index = this.books.findIndex(book => book.id === +id);
    if (index >= 0) {
      this.books[index] = { ...this.books[index], ...updateBookDto };
      return this.books[index];
    }
    return null;
  }

  remove(id: string) {
    this.books = this.books.filter(book => book.id !== +id);
    return { deleted: true };
  }
}
