import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateClientDto {

    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    location: string;

    @IsNotEmpty()
    @ApiProperty()
    contact: string;

    @IsOptional()
    @ApiProperty()
    subscriptionName?: string;

    @IsOptional()
    @ApiProperty()
    subscriptionStartDate?: string;

    @IsOptional()
    @ApiProperty()
    subscriptionEndDate?: string;

    createdBy:number;
}