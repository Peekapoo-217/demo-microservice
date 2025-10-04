import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  private books = [
    { id: 1, title: 'Clean Code' },
    { id: 2, title: 'Domain-Driven Design' },
  ];
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>) { }

  async findAll() {
    return await this.bookRepository.find();
  }

  async create(createBookDto: CreateBookDto) {
    const newBook = {
      ...createBookDto,
      availableCopies: 1,
      updatedAt: new Date,
      createdAt: new Date,
    }
    const book = await this.bookRepository.create(newBook);
    await this.bookRepository.insert(book);
    return book;
  }

  async findOne(id: string) {
    return await this.bookRepository.findOne({ where: { id } })
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
