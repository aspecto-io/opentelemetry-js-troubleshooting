import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { trace } from "@opentelemetry/api";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-otlp-grpc";

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
provider.register();

const tracer = trace.getTracerProvider().getTracer("");
tracer.startSpan("FROM WORKING PROCESS").end();

console.log("done");
