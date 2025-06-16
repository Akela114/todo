import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export default fp((instance, _options, done) => {
  instance.register(fastifySwagger, {
    openapi: {
      info: {
        title: "SampleApi",
        description: "Sample backend service",
        version: "1.0.0",
      },
      tags: Object.values(SWAGGER_TAGS),
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description:
              "Enter your bearer token in the format **Bearer &lt;token&gt;**",
          },
          refreshToken: {
            type: "apiKey",
            in: "cookie",
            name: "refreshToken",
            description: "Refresh token should be set in cookie",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  instance.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  done();
});
