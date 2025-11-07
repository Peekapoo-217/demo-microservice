import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksService } from './app.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard.guard';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get('display')
  findAll(@Req() req) {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('books/id')
  getDetails(@Req() req) {
    return this.booksService.getDetails(req.query.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/update')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post(':id/delete')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

   @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Post(':id/decrease-copies')
  async decreaseCopies(@Param('id') id: string, @Body() body: { quantity?: number }) {
    return this.booksService.decreaseAvailableCopies(id, body.quantity || 1);
  }

  @Post(':id/increase-copies')
  async increaseCopies(@Param('id') id: string) {
    return this.booksService.increaseAvailableCopies(id);
  }
}
