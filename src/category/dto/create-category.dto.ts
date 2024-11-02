import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty()
    parentId: number;

    @IsOptional()
    @ApiProperty()
    typeId: number;

    createdBy?:number;
}
