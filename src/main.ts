import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { LoggingInterceptor } from "./interceptors/logger.interceptor";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new LoggingInterceptor());

    app.setGlobalPrefix("api/v1");

    app.use(
        helmet({
            contentSecurityPolicy: false, // Disable CSP to enable GQL Playground
            crossOriginEmbedderPolicy: false, // this too
        }),
    );

    app.use(cookieParser());

    app.enableCors({
        origin: process.env.CLIENT,
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
        .setTitle("Weather API Proxy")
        .setDescription(
            `This API serves as a wrapper for a third-party weather API.

            Version: 1.0.1
            REST Endpoint: https://{Host}:{Port}/api/v1
            GraphQL Endpoint: https://{Host}:{Port}/graphql`,
        )
        .setVersion("1.0.1")
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
