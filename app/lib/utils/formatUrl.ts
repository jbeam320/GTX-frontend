export const formatUrl = (url: string) => {
  const [baseUrl, queryString] = url.split("?");
  const formattedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return queryString ? `${formattedBase}?${queryString}` : formattedBase;
};
