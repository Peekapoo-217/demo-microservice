import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Borrow } from './entities/borrow.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConsulService } from '@registry/consul';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepository: Repository<Borrow>,
    private httpService: HttpService,
    private consulService: ConsulService,
  ) { }

  async create(createBorrowDto: CreateBorrowDto) {
    try {
      const quantity = createBorrowDto.quantity || 1;

      const bookServiceUrl = await this.consulService.resolveService('book-service');

      const decreaseUrl = `${bookServiceUrl}/book/${createBorrowDto.bookId}/decrease-copies`;

      try {
        await firstValueFrom(
          this.httpService.post(decreaseUrl, { quantity })
        );
      } catch (error) {
        if (error.response?.data?.message) {
          throw new HttpException(
            error.response.data.message,
            error.response.status || HttpStatus.BAD_REQUEST
          );
        }
        throw new HttpException(
          'Failed to decrease book copies. Book may not be available.',
          HttpStatus.BAD_REQUEST
        );
      }

      const borrow = await this.borrowRepository.create(createBorrowDto);
      const savedBorrow = await this.borrowRepository.save(borrow);

      return {
        ...savedBorrow,
        message: `Book borrowed successfully (${quantity} ${quantity > 1 ? 'copies' : 'copy'})`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Failed to create borrow record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
