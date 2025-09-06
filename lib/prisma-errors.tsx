export const displayPrismaErrorCode = (_errorcode: string): string => {
  let message: string = "";
  switch (_errorcode) {
    case "P2002":
      message = "Unique constraint failed";
      break;
    default:
      message = _errorcode;
      break;
  }

  return message;
};
