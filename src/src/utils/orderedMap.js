export default function orderedMap(list, func, comp = (a, b) => a.id - b.id) {
  if (!list) return [];
  let sortedList = list.map((item, index) => ([item, index])).sort((a, b) => comp(a[0], b[0]));
  return sortedList.map(([item, index]) => func(item, index));
}