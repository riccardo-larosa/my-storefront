import { useQuery } from '@tanstack/react-query';

const DynamicContent = async ({  pageContent }: {  pageContent: string }) => {
    //return pageContent;
    return (
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    );

  };

  export const fetchContent = async (pageName: string, sectionName: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/content?pageName=` + pageName);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    const pageContent = data;
    console.log(pageContent);
    return pageContent;
  }

  export const useContent = (pageName: string, sectionName: string) => {
    return useQuery({
      queryKey: ['content', pageName, sectionName],
      queryFn: () => fetchContent(pageName, sectionName),
    });
  }
export default DynamicContent;
