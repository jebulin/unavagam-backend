import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    categoryId: number;

    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsOptional()
    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @ApiProperty()
    stock: number;

    createdBy?:number;

    shopId?: number;
}
