import { TRPCClientError } from "@trpc/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const normalizeZoom = (zoom: number): number => {
  // Adjust the calculation as necessary to fit the desired size
  return Math.max(1 / zoom, 0.5); // Ensure it never goes below 0.5, for instance
};

export type Return<T> = Readonly<[string, null]> | Readonly<[null, T]>;

export type AsyncFunction<T, K> = (input: T) => Promise<K>;

export const backendHookWrapper = async <T, K>(
  input: T,
  request: AsyncFunction<T, K>,
): Promise<Return<K>> => {
  try {
    const output: K = await request(input);

    return [null, output] as const;
  } catch (e) {
    if (e instanceof TRPCClientError) return [e.message, null] as const;
    else
      return ["An Error has occured. Please try again: \n" + e, null] as const;
  }
};
