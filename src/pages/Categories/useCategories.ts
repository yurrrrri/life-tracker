import CategorySeek from "@/server/api/flow/CategorySeek";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  // *** QUERY ***
  const findCategories = CategorySeek.query.findCategories();
  const { data: categoryData, isLoading, refetch } = useQuery(findCategories);

  return { categoryData, isLoading, refetch };
};
