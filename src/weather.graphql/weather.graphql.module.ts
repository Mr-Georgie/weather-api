import { Module } from '@nestjs/common';
import { WeatherGraphqlResolver } from './weather.graphql.resolver';

@Module({
  providers: [WeatherGraphqlResolver]
})
export class WeatherGraphqlModule {}
