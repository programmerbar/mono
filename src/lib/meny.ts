import type { GetProductsQueryResult } from "../../sanity.types";

export type ProductType = {
  _id: string;
  title: string;
};

export type Products = GetProductsQueryResult;

export type Product = Products[number];

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

export const extractProductTypes = (products: Products) => {
  return products
    .map((product) => product.productTypes)
    .flat()
    .filter(Boolean)
    .reduce((acc, productType) => {
      if (!acc.find((type) => type._id === productType!._id)) {
        acc.push(productType!);
      }

      return acc;
    }, [] as Array<ProductType>);
};

export const filterProducts = (
  products: Products,
  filter: {
    hideSoldOut: boolean;
    sort: SortOption;
    search: string;
    selectedProductType: string | null;
    studentPrice: boolean;
  },
) => {
  const { hideSoldOut, sort, search, selectedProductType, studentPrice } = filter;

  return products
    .filter((product: Product) => {
      if (hideSoldOut && product.isSoldOut) {
        return false;
      }

      if (!product.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (
        selectedProductType &&
        !product.productTypes?.map((type: ProductType) => type._id).includes(selectedProductType)
      ) {
        return false;
      }

      return true;
    })
    .sort((a: Product, b: Product) => {
      const aAlcohol = a.alcoholContent ?? 0;
      const bAlcohol = b.alcoholContent ?? 0;
      const aVolume = a.volume ?? 0;
      const bVolume = b.volume ?? 0;
      const aPrice = studentPrice ? a.priceList.student : a.priceList.ordinary;
      const bPrice = studentPrice ? b.priceList.student : b.priceList.ordinary;

      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "alcohol-asc":
          return aAlcohol - bAlcohol;
        case "alcohol-desc":
          return bAlcohol - aAlcohol;
        case "volume-asc":
          return aVolume - bVolume;
        case "volume-desc":
          return bVolume - aVolume;
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        default:
          return 0;
      }
    });
};
