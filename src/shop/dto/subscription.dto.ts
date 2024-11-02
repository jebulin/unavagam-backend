import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SubscriptionDto {

    @IsNotEmpty()
    @ApiProperty()
    subscriptionName: string;

    @IsNotEmpty()
    @ApiProperty()
    subscriptionStartDate: string;

    @IsNotEmpty()
    @ApiProperty()
    subscriptionEndDate: string;

}