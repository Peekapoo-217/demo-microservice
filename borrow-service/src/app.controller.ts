import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';

import { CreateBorrowDto } from './dto/create-borrow.dto';
import { JwtAuthGuard } from './guards/JwtAuthGuard.guard';
import { BorrowService } from './app.service';

@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req, @Body() createBorrowDto: CreateBorrowDto) {
    console.log('req.user', req.user);
    console.log('bookId:', createBorrowDto.bookId);
    createBorrowDto.userId = req.user.id;

    return await this.borrowService.create(createBorrowDto);
  }
}
