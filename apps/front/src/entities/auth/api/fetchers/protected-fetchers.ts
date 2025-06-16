import { createFetcherWrapper } from "@/shared/api";
import { coreApiWithAuth } from "../instance";

export const checkAuth = createFetcherWrapper(
  coreApiWithAuth,
  () => "auth/check",
  "get",
);
