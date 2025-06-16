import { coreApi } from "@/shared/api";
import { useAuthStore } from "../store/auth-store";
import { refreshTokens } from "./fetchers/base-fetchers";

export const coreApiWithAuth = coreApi.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        } else {
          await refreshTokens();
          return coreApiWithAuth(request);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401) {
          await refreshTokens();
          return coreApiWithAuth(request);
        }
        return response;
      },
    ],
  },
});
