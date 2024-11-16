import {
    Controller,
    Get,
    Param,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { CityParamDto } from "./dto/city-param.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { WeatherService } from "./weather.service";
import {
    createResponse,
    CustomApiResponse,
} from "src/common/utils/general-utils";

@ApiTags("weather")
@Controller("weather")
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get(":city")
    @ApiParam({ name: "city", type: "string" })
    @UsePipes(ValidationPipe)
    @ApiOperation({
        summary: "GET: current weather data for a city",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        // type: WeatherResponse,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async getWeather(
        @Param() params: CityParamDto,
    ): Promise<CustomApiResponse> {
        const city = await this.weatherService.getCurrentCityData(params.city);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            city,
        );
    }
}
