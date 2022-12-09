import { useCallback, useEffect, useState } from "react";

const useFetch = ({
  path,
  options,
  method,
}: {
  path?: string;
  options?: any;
  method: "GET" | "POST" | "PUT" | "DELETE";
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | undefined>();

  const fetchData = useCallback(() => {
    async ({
      path,
      options,
      method,
    }: {
      path?: string;
      options?: any;
      method: "GET" | "POST" | "PUT" | "DELETE";
    }) => {
      try {
        if (!path) return;
        setLoading(true);
        const response = await fetch(path, {
          method: method,
          ...options,
        });

        setStatusCode(response?.status);

        let data = await response.json();

        setData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
  }, [path]);

  useEffect(() => {
    fetchData();
  }, [path]);

  return {
    data,
    loading,
    mutate: fetchData,
    statusCode,
  };
};

export default useFetch;
