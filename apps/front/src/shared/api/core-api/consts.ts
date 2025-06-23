import type { CoreApiBasicResponse } from "@packages/schemas/common";

export const CORE_API_BASIC_RESPONSE_FALLBACK = {
  message: "Что-то пошло не так",
  statusCode: 500,
} satisfies CoreApiBasicResponse;
