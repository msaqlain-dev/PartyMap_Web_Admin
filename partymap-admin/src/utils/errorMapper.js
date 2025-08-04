export default function errorMapper(error) {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return "An unexpected error occurred.";
}
