import { BASE_URL } from "config";
import useSWR, { SWRConfiguration } from "swr";

const useSWRFetcher = <T>(url?: string, options?: SWRConfiguration) => {
  const token =
    typeof window !== "undefined" &&
    window?.localStorage?.getItem("ACCESS_TOKEN");

  const getFetcher = (url: string) => {
    let API_URL = new URL(`${BASE_URL}${url}`);

    return fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          const error = new Error(data?.error);
          throw error;
        });
      }
      return res.json().then((data) => data?.data);
    });
  };

  const { data, error, isValidating, mutate } = useSWR<T>(
    url ? (url?.includes("undefined") ? null : url) : null,
    getFetcher,
    {
      errorRetryCount: options?.errorRetryCount || 1,
      revalidateOnFocus: options?.revalidateOnFocus || false,
      ...options,
    }
  );

  return {
    data,
    error,
    mutate,
    isValidating,
  };
};

export default useSWRFetcher;
