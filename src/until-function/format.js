export const capitalizeFirstLetter = (str) => {
  if (!str) return str; // kiểm tra nếu chuỗi rỗng hoặc null
  return str.charAt(0).toUpperCase() + str.slice(1);
};
