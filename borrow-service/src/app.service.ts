import { Injectable } from '@nestjs/common';
import { Borrow } from './entities/borrow.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepository: Repository<Borrow>,
  ) { }

  async create(createBorrowDto: CreateBorrowDto) {
    const borrow = await this.borrowRepository.create(createBorrowDto);
    return await this.borrowRepository.save(borrow);
  }
}
