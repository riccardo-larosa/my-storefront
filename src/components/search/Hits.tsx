import React, { useEffect, useState } from 'react';
import HitComponent from "./Hit";
import { useProducts } from "./ProductsProvider";
import DynamicContent, { fetchContent } from '../content/DynamicContent';
import { usePathname } from "next/navigation";
import NoResults from './NoResults';

export default function Hits(): JSX.Element {

  const { page } = useProducts();
  const pathname = usePathname().replace(/\//g, "_");
  console.log(`pathname: ${pathname}`);
  
  const [pageContent, setPageContent] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await fetchContent(pathname, "react");
        setPageContent(content);
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };

    loadContent();
  }, [pathname]);

  console.log(`pageContent: ${pageContent}`);

  if (!page) {
    return <NoResults displayIcon={false} />;
  }

  if (page.data.length) {
    return (
      <>
        {pageContent && <DynamicContent pageContent={pageContent} format='react' />}
        <div className="grid max-w-[80rem] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {page.data.map((hit) => {
            const {
              response: { id },
            } = hit;
            return (
              <div
                className="list-none justify-items-stretch rounded-lg animate-fadeIn"
                key={id}
              >
                <HitComponent hit={hit} />
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return <NoResults displayIcon={false} />;
}

