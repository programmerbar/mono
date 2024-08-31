import React, { useState, useMemo } from "react";
import { Martini } from "lucide-react"; // Assuming you're using lucide-react for icons
import type { GetProductsQueryResult } from "../../sanity.types";
import { urlFor } from "../lib/data/sanity/image";

type ProductType = {
  _id: string;
  title: string;
};

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const SORT_OPTIONS = [
  { label: "Navn A-Å", value: "name-asc" },
  { label: "Navn Å-A", value: "name-desc" },
  { label: "Pris lav-høy", value: "price-asc" },
  { label: "Pris høy-lav", value: "price-desc" },
  { label: "Alkohol lav-høy", value: "alcohol-asc" },
  { label: "Alkohol høy-lav", value: "alcohol-desc" },
  { label: "Volum lav-høy", value: "volume-asc" },
  { label: "Volum høy-lav", value: "volume-desc" },
] as const;

type Products = GetProductsQueryResult;
type Product = Products[number];

type ProductListProps = {
  data: Products;
};

export const ProductList = ({ data }: ProductListProps) => {
  const [hideSoldOut, setHideSoldOut] = useState<boolean>(true);
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [search, setSearch] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [studentPrice, setStudentPrice] = useState<boolean>(true);

  const productTypes = useMemo(() => {
    return data
      .map((product) => product.productTypes)
      .flat()
      .filter(Boolean)
      .reduce((acc, productType) => {
        if (!acc.find((type) => type._id === productType!._id)) {
          acc.push(productType!);
        }

        return acc;
      }, [] as Array<ProductType>);
  }, [data]);

  const filteredProducts = useMemo(() => {
    return data
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
  }, [data, hideSoldOut, search, selectedProductType, sort, studentPrice]);

  return (
    <div className="flex flex-col gap-8 py-10 md:flex-row">
      <div
        className={`flex h-fit w-full flex-col divide-y rounded-xl border-2 bg-background p-4 shadow-xl md:sticky md:w-1/4`}
      >
        <div className="flex flex-col gap-2 py-2">
          <label htmlFor="search">Søk</label>
          <div>
            <input
              className="w-full rounded-xl border px-2 py-1"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search"
              placeholder="Søk etter produkt"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          <label htmlFor="sort">Sorter etter</label>
          <select
            className="w-full rounded-xl border px-2 py-1"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            id="sort"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 py-4">
          <label htmlFor="productType">Type</label>
          <select
            className="w-full rounded-xl border px-2 py-1"
            value={selectedProductType || ""}
            onChange={(e) => setSelectedProductType(e.target.value || null)}
            id="productType"
          >
            <option value={""}>Alle</option>
            {productTypes?.map((productType) => (
              <option key={productType._id} value={productType._id}>
                {productType.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center gap-4 py-4">
          <label htmlFor="hideSoldOut">Skjul utsolgte</label>
          <input
            className="h-4 w-4 rounded-sm checked:border-2 checked:border-primary checked:bg-primary"
            type="checkbox"
            checked={hideSoldOut}
            onChange={(e) => setHideSoldOut(e.target.checked)}
            id="hideSoldOut"
          />
        </div>
        <div className="flex flex-row items-center gap-4 py-4">
          <label htmlFor="studentPrice">Vis studentpris</label>
          <input
            className="h-4 w-4 rounded-sm checked:border-2 checked:border-primary checked:bg-primary"
            type="checkbox"
            checked={studentPrice}
            onChange={(e) => setStudentPrice(e.target.checked)}
            id="studentPrice"
          />
        </div>
      </div>

      <div className="flex-1">
        {filteredProducts.length === 0 ? (
          <p className="mt-16 text-center text-3xl">
            Finner ingen produkter som matcher dine filter
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(
              ({ _id, name, image, priceList, producer, variants, isSoldOut, productTypes }) => (
                <li
                  key={_id}
                  className="relative overflow-hidden rounded-xl border-2 bg-background shadow-xl"
                >
                  {isSoldOut && (
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-30">
                      <p className="rotate-45 text-4xl font-medium text-white">Utsolgt</p>
                    </div>
                  )}

                  <div className="border-b-2 border-border">
                    {image ? (
                      <img
                        src={urlFor(image).height(600).width(600).url()}
                        alt={name}
                        className="h-48 w-full bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                        <Martini className="h-16 w-16 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <a className="hover:underline" href={`/produkt/${_id}`}>
                      <h2 className="text-2xl font-medium">{name}</h2>
                    </a>
                    {variants && variants.length > 1 && (
                      <p className="text-sm text-gray-700">({variants.join(", ")})</p>
                    )}
                    <p className="text-lg">
                      {studentPrice ? priceList.student : priceList.ordinary} kr
                    </p>
                    <p className="font-mono text-sm font-medium text-gray-700">{producer}</p>
                    {productTypes && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {productTypes.map((productType: ProductType) => (
                          <span
                            key={productType._id}
                            className="rounded-xl bg-primary bg-opacity-10 px-2 py-1 text-xs font-medium text-white"
                          >
                            {productType.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
