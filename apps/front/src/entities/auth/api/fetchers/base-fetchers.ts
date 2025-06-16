import {
  coreApi,
  createFetcherWrapper,
  withOnSuccessHook,
  withValidation,
} from "@/shared/api";
import { type Login, authTokensSchema } from "../../model";
import { useAuthStore } from "../../store/auth-store";

export const login = withOnSuccessHook(
  withValidation(
    createFetcherWrapper<undefined, undefined, Login>(
      coreApi,
      () => "auth",
      "post",
    ),
    authTokensSchema,
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
