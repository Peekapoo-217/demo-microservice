import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksService } from './app.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get('display')
  findAll(@Req() req) {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

   @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  
}
