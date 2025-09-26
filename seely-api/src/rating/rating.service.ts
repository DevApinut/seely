import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly repository: Repository<Rating>,
  ) {}

  // for init to create data
  async onModuleInit() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save([
        { name: 'ส สงเสริม', description: 'ภาพยนตร์ที่ส่งเสริมการเรียนรู้และควรส่งเสริมใหมีการดู' },
        { name: 'ท ทั่วไป', description: 'ภาพยนตร์ที่เหมาะสมกับผู้ดูทั่วไป ' },
        { name: 'น 13+', description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป' },
        { name: 'น 15+', description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 15 ปีขึ้นไป' },
        { name: 'น 18+', description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 18 ปีขึ้นไป' },
        { name: 'ฉ 20+', description: ' ภาพยนตร์เรื่องนี้ ห้ามผู้มีอายุตํ่ากวา 20 ปีดู (ตรวจบัตรประชาชน)' },
      ]);
    }
  }

  
}
