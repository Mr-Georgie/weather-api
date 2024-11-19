import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class RestThrottlerGuard extends ThrottlerGuard {}
