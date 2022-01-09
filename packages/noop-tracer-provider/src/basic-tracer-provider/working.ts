import { trace } from "@opentelemetry/api";
import {
  SimpleSpanProcessor,
  BasicTracerProvider,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-otlp-grpc";

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
trace.setGlobalTracerProvider(provider);

const tracer = trace.getTracerProvider().getTracer("");
tracer.startSpan("FROM WORKING PROCESS").end();

console.log("done");
