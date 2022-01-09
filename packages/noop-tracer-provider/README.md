# `noop-tracer-provider`

## TL;DR

- For `NodeTracerProvider`("@opentelemetry/sdk-trace-node") - make sure `provider.register()` is called in your code.
- For custom `BasicTracerProvider`("@opentelemetry/sdk-trace-base") - make sure `trace.setGlobalTracerProvider(provider);` is called in your code.

This example demonstrate how forgetting to register the tracer provider means you are using the [default NoopTracerProvider](https://github.com/open-telemetry/opentelemetry-js-api/blob/ae9bead17750d35dec4b63cfae098087666abc85/src/trace/NoopTracerProvider.ts#L27)

## In Depth

### What is Tracer Provider

You installed OpenTelemetry for tracing, so the end goal is to view a trace.

- Trace is composed of [`Span`](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#span)s, so to have a trace you must first create spans.
- In OpenTelemetry, to create a span you first need to own a [`Tracer`](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#tracer), on which you call [`startSpan(...)`](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#span-creation)
- To own a `Tracer`, you need to call the function `getTracer` on a [`TracerProvider`](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#tracerprovider)
- Most of the times, it is usually handy to access the global `TracerProvider` via:

```js
import { trace } from "@opentelemetry/api";
trace.getTracerProvider().getTracer("");
```

Now you probably connect the dots. If you setup your own provider but do not register it, then when you later invoke `trace.getTracerProvider()`, you don't end up with the provider you worked so hard to configure.

### Tracer Provider Rule

TracerProvider is the top component for creating spans, and as such, it configures all the things below it with:

- processors (where you spans are being exported)
- OpenTelemetry Resource
- Samplers
- Propagators
- Limits
- IdGenerator

It can also supply custom defaults or automatic configuration from environment variables, and you must use one in each installation of OpenTelemetry into an application.

### Types of Tracer Provider

- If you instrument a nodejs application, you probably want to use `NodeTracerProvider` from "@opentelemetry/sdk-trace-node".
- If you are installing in the browser, you probably need to use `WebTracerProvider` from "@opentelemetry/sdk-trace-web".
- **[Advanced Users]** If you need custom behavior and want to create your own tracer provider, you can directly use or subclass `BasicTracerProvider` from "@opentelemetry/sdk-trace-base".
- **[Easiest Setup]** If you use a distribution of OpenTelemetry JS, which is common for telemetry vendors like Aspecto, this distribution package is where the `TracerProvider` registration takes place.

### NoopTracerProvider

Before registering **your** TracerProvider, you automatically get a default `NoopTracerProvider` implementation which can cause your installation to appear non-functional in multiple ways.

This provider spawn `NoopTracer` which in turn starts each span as `NonRecordingSpan` which means they won't be exported! Everything else will appear working in your installation:

- Instrumentation libraries are installed and working
- Spans are started and ended.
- SpanProcessor is invoked

You can test if your spans are `NonRecordingSpan` by creating a span and `console.log` it:

```js
import { trace } from "@opentelemetry/api";
const tracer = trace.getTracerProvider().getTracer("");
const span = tracer.startSpan("test non recording span");
console.log(span);
// NonRecordingSpan {
//   _spanContext: {
//     traceId: '00000000000000000000000000000000',
//     spanId: '0000000000000000',
//     traceFlags: 0
//   }
// }
```

This can be a tricky place to search for problems, so don't fall victim to unregistered trace providers!

### Common Pitfalls

#### Forgetting to Register Provider

For `NodeTracerProvider`, you need code that looks like this in your application:

```js
const provider = new NodeTracerProvider();
// initialize provider, e.g. `provider.addSpanProcessor(...);`
provider.register(); // This one is important
```

For `BasicTracerProvider`, you need code that looks like this in your application:

```js
const provider = new BasicTracerProvider();
// initialize provider, e.g. `provider.addSpanProcessor(...);`
trace.setGlobalTracerProvider(provider); // This one is important
```
