// JWT 토큰 생성 함수
export const generateToken = (): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "user",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24시간 유효
      loginTime: new Date().toISOString(),
    })
  );
  const signature = btoa("dummy-signature-for-demo");

  return `${header}.${payload}.${signature}`;
};

// 환경변수에서 비밀번호 가져오기
export const PASSWORD = import.meta.env.VITE_PASSWORD || "";
