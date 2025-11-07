import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
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

  async decreaseAvailableCopies(id: string, quantity: number) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.availableCopies < quantity) {
      throw new Error(`Not enough copies available. Only ${book.availableCopies} copies left`);
    }

    book.availableCopies -= quantity;
    await this.bookRepository.save(book);

    return {
      success: true,
      bookId: id,
      borrowedQuantity: quantity,
      remainingCopies: book.availableCopies,
    };
  }

  async increaseAvailableCopies(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    book.availableCopies += 1;
    await this.bookRepository.save(book);

    return {
      success: true,
      bookId: id,
      remainingCopies: book.availableCopies,
    };
  }
}
