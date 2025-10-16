import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getDetails(id: string) {
    return await this.bookRepository.findOne({ where: { id } })
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updatedBook = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updatedBook);
  }


  async remove(id: string) {
    try {
      await this.bookRepository.delete(id);
    } catch (error) {
      throw new Error('Error deleting book');
    }
    return { deleted: true };
  }
}
