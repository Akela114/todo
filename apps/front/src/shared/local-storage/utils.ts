import type { z } from "zod";
import { LOCAL_STORAGE_SCHEMAS } from "./config";

export const setLocalStorageData = <
  T extends keyof typeof LOCAL_STORAGE_SCHEMAS,
>(
  key: T,
  data: z.infer<(typeof LOCAL_STORAGE_SCHEMAS)[T]["schema"]>,
) => {
  const { key: localStorageKey } = LOCAL_STORAGE_SCHEMAS[key];

  localStorage.setItem(localStorageKey, JSON.stringify(data));
};

export const getLocalStorageData = <
  T extends keyof typeof LOCAL_STORAGE_SCHEMAS,
>(
  key: T,
  defaultValue: z.infer<(typeof LOCAL_STORAGE_SCHEMAS)[T]["schema"]>,
) => {
  const { key: localStorageKey, schema } = LOCAL_STORAGE_SCHEMAS[key];

  const localStorageData = JSON.parse(
    localStorage.getItem(localStorageKey) ?? "",
  );
  const { success, data } = schema.safeParse(localStorageData);

  return success && data ? data : defaultValue;
};
