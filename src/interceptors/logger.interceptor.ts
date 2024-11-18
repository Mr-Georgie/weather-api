import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        let method: string;
        let url: string;

        if (context.getType() === "http") {
            const ctx = context.switchToHttp();
            const request = ctx.getRequest();
            method = request.method;
            url = request.url;
        } else {
            const gqlContext = GqlExecutionContext.create(context);
            const info = gqlContext.getInfo();
            method = info.operation.operation.toUpperCase(); // QUERY or MUTATION
            url = info.fieldName; // The name of the query/mutation being executed
        }

        return next
            .handle()
            .pipe(
                tap(() =>
                    this.logger.log(`${method} ${url} - ${Date.now() - now}ms`),
                ),
            );
    }
}
