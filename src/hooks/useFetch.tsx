import { BASE_URL } from "config";
import { useEffect, useState } from "react";
import useMounted from "./useMounted";

const useFetch = (path?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | undefined>();

  const isMounted = useMounted();

  const fetchData = async ({
    path,
    method,
    isFormData = false,
    body,
  }: {
    path?: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    isFormData?: boolean;
    body?: any;
  }) => {
    try {
      if (!path) return;
      setLoading(true);

      let ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");

      const headers: any = {};
      ACCESS_TOKEN && (headers["authorization"] = `Bearer ${ACCESS_TOKEN}`);
      !isFormData && (headers["Content-Type"] = "application/json");
      const options: RequestInit = {
        method: method,
        headers,
        body: body,
      };
      !body && delete options?.body;

      const response = await fetch(BASE_URL + path, options);

      isMounted && setStatusCode(response?.status);

      let data = await response.json();

      if (data?.ACCESS_TOKEN) {
        localStorage?.setItem("ACCESS_TOKEN", data?.ACCESS_TOKEN);
      }

      isMounted && setData(data);
      return { data, status: response?.status };
    } catch (error) {
      return { data: error, status: 400 };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ path: path, method: "GET" });
  }, [path, isMounted]);

  return {
    data,
    loading,
    mutate: fetchData,
    statusCode,
  };
};

export default useFetch;
