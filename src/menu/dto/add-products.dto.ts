import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddProductsDto {
    @IsNotEmpty()
    @ApiProperty()
    menuId: number;

    @IsNotEmpty()
    @ApiProperty()
    productIds: number[];

    createdBy: number;

}
