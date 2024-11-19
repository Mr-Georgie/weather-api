import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context); // Extract GraphQL context

        if (!gqlCtx) {
            return; // Skip if it's not a GraphQL context
        }

        const ctx = gqlCtx.getContext();
        return { req: ctx.req, res: ctx.res };
    }
}
