import { useQuery } from '@tanstack/react-query';

const DynamicContent = async ({ content_id, format }: { content_id: string, format: string }) => {
  //return pageContent;
  console.log(`pageContent: ${content_id}`);
  const pageContent = await fetchContent(content_id, format);
  if (!pageContent) {
    return <div>Content not found</div>;
  }
  if (format === "html") {
    return (
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    );
  } else {  
    return "not implemented yet: react component";
  }

};

const fetchContent = async (content_id: string, format: string = "html") => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/content?content_id=` + content_id);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  if (format === "html") {
    console.log(`data.html: ${data.html}`);
    return data.html;
  } else {
    return "not implemented yet: react component";
  }
}

// export const useContent = (content_id: string, sectionName: string) => {
//   return useQuery({
//     queryKey: ['content', content_id, sectionName],
//     queryFn: () => fetchContent(content_id, sectionName),
//   });
// }
export default DynamicContent;
