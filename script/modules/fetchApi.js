export const loadGoods = async (fetchParams) => {
  const result = await fetch(fetchParams);
  const data = await result.json();

  return data;
};
