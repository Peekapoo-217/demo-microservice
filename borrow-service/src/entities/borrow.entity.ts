import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Borrow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    bookId: string;

    @CreateDateColumn({ type: 'timestamp' })
    borrowDate: Date;
}
