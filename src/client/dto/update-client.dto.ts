import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {

    updatedBy: number;

    @IsNotEmpty()
    @ApiProperty()
    id:number
}
