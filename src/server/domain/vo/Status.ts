export const Status = {
  NOT_STARTED: "NOT_STARTED",
  JUST_STARTED: "JUST_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING: "PENDING",
  ONEDAY: "ONEDAY",
  DONE: "DONE",
} as const;

export const getStatusName = (status: keyof typeof Status) => {
  switch (status) {
    case "NOT_STARTED":
      return "예정";
    case "JUST_STARTED":
      return "시작";
    case "IN_PROGRESS":
      return "진행중";
    case "PENDING":
      return "보류";
    case "ONEDAY":
      return "언젠가";
    case "DONE":
      return "완료";
    default:
      return status;
  }
};

export const getStatusColor = (status: keyof typeof Status) => {
  switch (status) {
    case "NOT_STARTED":
      return "gray";
    case "JUST_STARTED":
      return "blue";
    case "IN_PROGRESS":
      return "yellow";
    case "PENDING":
      return "orange";
    case "ONEDAY":
      return "purple";
    case "DONE":
      return "green";
    default:
      return "gray";
  }
};
