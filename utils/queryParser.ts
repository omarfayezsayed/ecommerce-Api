export const queryParser = (query: any): object => {
  const clone = { ...query };
  const features = ["sort", "page", "limit", "fields"];
  features.forEach((feature) => {
    delete clone[feature];
  });
  let queryString = JSON.stringify(clone);

  queryString = queryString.replace(/\b(lt|lte|gt|gte)\b/g, (match) => {
    return `$${match}`;
  });
  const queryObj = JSON.parse(queryString);
  const parsedQuery: any = { filter: queryObj };
  features.forEach((feature) => {
    if (query[feature]) parsedQuery[feature] = query[feature];
    else parsedQuery[feature] = null;
  });
  return parsedQuery;
};
