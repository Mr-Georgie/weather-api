import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.fliter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { LoggingInterceptor } from "./interceptors/logger.interceptor";
import { GraphQLExceptionFilter } from "./common/filters/graphql-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(
        new HttpExceptionFilter(),
        new GraphQLExceptionFilter(),
    );
    app.useGlobalInterceptors(new LoggingInterceptor());

    app.setGlobalPrefix("api/v1");

    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
        .setTitle("Weather Proxy")
        .setDescription(
            "This API serves as a wrapper for a third-party weather API",
        )
        .setVersion("1.0")
        .addTag("") // will add something here
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            "access-token",
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document, {
        customCssUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
        ],
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
