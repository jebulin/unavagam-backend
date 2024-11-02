import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    startTime: string;

    @IsNotEmpty()
    @ApiProperty()
    endTime: string;

    shopId: number;

    createdBy: number;

}
