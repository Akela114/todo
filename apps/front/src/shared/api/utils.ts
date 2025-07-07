import { HTTPError, type KyInstance } from "ky";
import type { z } from "zod";

export const createFetcherWrapper =
  <
    UrlParams = undefined,
    SearchParams extends
      | Record<string, string | number | Array<string | number> | undefined>
      | undefined = undefined,
    Body = undefined,
    Response = unknown,
  >(
    ky: KyInstance,
    urlFactory: (urlParams: UrlParams) => string,
    method: "get" | "post" | "put" | "delete",
  ) =>
  async (
    ...[options]: UrlParams | SearchParams | Body extends undefined
      ? []
      : [
          (UrlParams extends undefined
            ? EmptyObject
            : {
                urlParams: UrlParams;
              }) &
            (SearchParams extends undefined
              ? EmptyObject
              : {
                  searchParams: SearchParams;
                }) &
            (Body extends undefined ? EmptyObject : { body: Body }),
        ]
  ) => {
    const response = await ky[method]<Response>(
      urlFactory(
        options && "urlParams" in options
          ? options.urlParams
          : (undefined as UrlParams),
      ),
      {
        searchParams:
          options && "searchParams" in options
            ? Object.entries(options.searchParams).flatMap(([key, value]) => {
                if (value === undefined) return [];

                if (Array.isArray(value)) {
                  return value.map((v) => [key, v]);
                }
                return [[key, value]];
              })
            : undefined,
        json: options && "body" in options ? options.body : undefined,
      },
    );

    return response.json();
  };

export const withValidation = <Args extends unknown[], Result>(
  callback: (...args: Args) => Promise<unknown>,
  responseSchema: z.ZodType<Result>,
) => {
  return async (...args: Args) => {
    const result = await callback(...args);
    return responseSchema.parse(result);
  };
};

export const withHttpErrorParsing = <Args extends unknown[], Result, Error>(
  callback: (...args: Args) => Promise<Result>,
  errorSchema: z.ZodType<Error>,
  defaultError: Error,
) => {
  return async (...args: Args) => {
    try {
      const result = await callback(...args);
      return result;
    } catch (err) {
      if (err instanceof HTTPError) {
        const errResponse = await err.response.json();
        const { success, data } = errorSchema.safeParse(errResponse);
        throw success ? data : defaultError;
      }
      throw err;
    }
  };
};

export const withOnSuccessHook = <Args extends unknown[], Result>(
  callback: (...args: Args) => Promise<Result>,
  onSuccess: (result: Result) => void,
) => {
  return async (...args: Args) => {
    const result = await callback(...args);
    onSuccess(result);
    return result;
  };
};
