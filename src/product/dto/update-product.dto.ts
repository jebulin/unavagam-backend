import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsNotEmpty()
    @ApiProperty()
    id: number;

    updatedBy:number;
}
