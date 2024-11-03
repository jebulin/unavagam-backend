import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { IProductInfo } from "../interface/products.interface";

export class CreateOrderDto {

    @IsOptional()
    @ApiProperty()
    type: number;

    @IsNotEmpty()
    @ApiProperty()
    products: IProductInfo[]
    

    @IsNotEmpty()
    @ApiProperty()
    total: number;

    @IsNotEmpty()
    @ApiProperty()
    totalQuantity: number;

    @IsOptional()
    @ApiProperty()
    customerId: number;

    @IsNotEmpty()
    @ApiProperty()
    paymentMethod: string;

    @IsOptional()
    @ApiProperty()
    paymentStatus: number;

    orderId: string;

    shopId: number;

    createdBy:number;
}
