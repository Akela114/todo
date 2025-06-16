import ky from "ky";
import { router } from "../../router/router";

export const coreApi = ky.extend({
  prefixUrl: "/api",
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          router.navigate({ to: "/auth/login" });
        }
        return response;
      },
    ],
  },
});
