import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { trace } from "@opentelemetry/api";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-otlp-grpc";

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
// provider.register(); // <------------------- this is missing

const tracer = trace.getTracerProvider().getTracer("");
const span = tracer.startSpan("FROM NON WORKING PROCESS");

// following line prints
// NonRecordingSpan {
//   _spanContext: {
//     traceId: '00000000000000000000000000000000',
//     spanId: '0000000000000000',
//     traceFlags: 0
//   }
// }
console.log(span);
span.end();

console.log("done");
