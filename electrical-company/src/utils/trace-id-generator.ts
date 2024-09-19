import {injectable} from 'tsyringe';
import { traceparent } from "tctx";

@injectable()
export class TraceIdGenerator {
    public generateNew(): string {
        return traceparent.make().toString();
    }
}