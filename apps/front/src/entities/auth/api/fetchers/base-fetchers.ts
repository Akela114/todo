import {
  CORE_API_BASIC_RESPONSE_FALLBACK,
  coreApi,
  createFetcherWrapper,
  withHttpErrorParsing,
  withOnSuccessHook,
  withValidation,
} from "@/shared/api";
import { type Login, authTokensSchema } from "@packages/schemas/auth";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import { useAuthStore } from "../../store/auth-store";

export const login = withOnSuccessHook(
  withHttpErrorParsing(
    withValidation(
      createFetcherWrapper<undefined, undefined, Login>(
        coreApi,
        () => "auth",
        "post",
      ),
      authTokensSchema,
    ),
    coreApiBasicResponseSchema,
    CORE_API_BASIC_RESPONSE_FALLBACK,
  ),
  ({ accessToken }) => useAuthStore.getState().setAccessToken(accessToken),
);

export const refreshTokens = withOnSuccessHook(
  withValidation(() => {
    const currentRefreshPromise = useAuthStore.getState().refreshPromise;
    if (currentRefreshPromise) {
      return currentRefreshPromise;
    }

    const newRefreshPromise = createFetcherWrapper(
      coreApi,
      () => "auth/refresh",
      "post",
    )();

    useAuthStore.getState().setRefreshPromise(newRefreshPromise);

    return newRefreshPromise;
  }, authTokensSchema),
  ({ accessToken }) => {
    useAuthStore.getState().setAccessToken(accessToken);
    useAuthStore.getState().setRefreshPromise(null);
  },
);

export const logout = withOnSuccessHook(
  createFetcherWrapper(coreApi, () => "auth/logout", "post"),
  () => useAuthStore.getState().setAccessToken(null),
);
