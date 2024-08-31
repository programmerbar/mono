import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GetProductsQueryResult } from "../../sanity.types";
import { urlFor } from "../lib/data/sanity/image";

const MAX = 6;
const DURATION = 10 * 1000;
const OFFSET = 200;

type ProductProps = {
  product: GetProductsQueryResult[number];
};

const Product = ({ product }: ProductProps) => {
  return (
    <div className="flex items-center bg-background h-full border rounded-xl overflow-hidden">
      {product.image && (
        <div className="border-r-2 border-border bg-white h-full flex items-center justify-center">
          <img
            src={urlFor(product.image).height(300).width(300).url()}
            alt={product.name}
            className="w-full bg-white object-contain"
          />
        </div>
      )}

      <div className="flex items-center justify-between w-full p-5">
        <p className="text-4xl line-clamp-1 text-ellipsis">{product.name}</p>
        <p className="text-5xl w-full max-w-max">
          {product.priceList.student} kr
        </p>
      </div>
    </div>
  );
};

type ProductScreenProps = {
  products: GetProductsQueryResult;
};

export const ProductScreen = ({ products }: ProductScreenProps) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(products.length / MAX);
  const productsOnPage = products.slice(page * MAX, (page + 1) * MAX);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = page + 1;

      if (nextPage >= totalPages) {
        setPage(0);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    }, DURATION);

    return () => clearInterval(interval);
  }, [page, totalPages]);

  const direction = page === 0 ? "right" : "left";

  const variants = {
    initial: (direction: string) => ({
      x: direction === "left" ? OFFSET : -OFFSET,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "left" ? -OFFSET : OFFSET,
      opacity: 0,
    }),
  };

  return (
    <div className="flex bg-primary flex-col max-h-screen h-full overflow-hidden">
      <div className="relative h-full w-full">
        <AnimatePresence custom={direction}>
          <div className="absolute grid grid-cols-2 grid-rows-3 gap-4 h-full w-full p-4 flex-1">
            {productsOnPage.map((product) => (
              <motion.div
                key={product._id}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Product product={product} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <p className="text-center">
        {page + 1} / {totalPages}
      </p>
    </div>
  );
};
