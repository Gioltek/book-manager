import { useLogin } from "./LoginContext";

export function useFetch(): any {
  const { setIsLoading } = useLogin();
  async function fetchData(query: string) {
    setIsLoading(true);
    const res = await fetch(query);
    const data = await res.json();
    setIsLoading(false);
    return data;
  }

  return { fetchData };
}
