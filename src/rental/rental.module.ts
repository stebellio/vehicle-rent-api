import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  controllers: [RentalController],
  providers: [RentalService],
  imports: [PrismaModule, UserModule, VehicleModule],
})
export class RentalModule {}
