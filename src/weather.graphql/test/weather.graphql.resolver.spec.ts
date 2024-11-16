import { Test, TestingModule } from "@nestjs/testing";
import { WeatherGraphqlResolver } from "../weather.graphql.resolver";

describe("WeatherGraphqlResolver", () => {
    let resolver: WeatherGraphqlResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WeatherGraphqlResolver],
        }).compile();

        resolver = module.get<WeatherGraphqlResolver>(WeatherGraphqlResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
