export type ParamKey = keyof typeof QUERY_PARAM_KEYS;

export const QUERY_PARAM_KEYS = {
  hideSoldOut: "sold-out",
  sort: "sort",
  search: "search",
  selectedProductType: "type",
  studentPrice: "student",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const SORT_OPTIONS = [
  { label: "Navn A-Å", value: "name-asc" },
  { label: "Navn Å-A", value: "name-desc" },
  { label: "Pris lav-høy", value: "price-asc" },
  { label: "Pris høy-lav", value: "price-desc" },
  { label: "Alkohol lav-høy", value: "alcohol-asc" },
  { label: "Alkohol høy-lav", value: "alcohol-desc" },
  { label: "Volum lav-høy", value: "volume-asc" },
  { label: "Volum høy-lav", value: "volume-desc" },
] as const;
