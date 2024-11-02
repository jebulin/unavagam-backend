import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateRoleDto {
    @IsNotEmpty()
    @ApiProperty()
    roleId: number;

    @IsNotEmpty()
    @ApiProperty()
    userId: number;

    updatedBy?:number;
}
