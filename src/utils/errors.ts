// Error handling
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    const message = error.response.data.message;

    if (message === "DATA_ALREADY_EXISTS") {
      return "동일한 데이터가 존재합니다.";
    }
    return message;
  }
  if (error.message) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};
