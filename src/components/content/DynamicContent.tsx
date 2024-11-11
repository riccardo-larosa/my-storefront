import { useQuery } from '@tanstack/react-query';
import { ComponentMap } from './Components';

const DynamicContent = async ({  pageContent, format }: {  pageContent: string, format: string }) => {
  //return pageContent;
  if (format === "html") {
    return (
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    );
  } else { // react
    const components = JSON.parse(pageContent);
    return (
      <div className="container mx-auto">
        {components.map((componentData: any, index: number) => {
          const componentConfig = ComponentMap[componentData.type as keyof typeof ComponentMap];
          const ComponentToRender = componentConfig.reactComponent;
          
          if (!ComponentToRender) {
            console.warn(`No component found for type: ${componentData.type}`);
            return null;
          }
  
          return (
            <div key={index}>
              <ComponentToRender {...componentData.props} />
            </div>
          );
        })}
      </div>
    );
  }
 

};


export const fetchContent = async (content_id: string, format: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/content?content_id=` + content_id);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  const pageContent = data;
  console.log(`pageContent: ${pageContent}`);
  if (!pageContent) {
    return null;
  }
  if (format === "html") {
    return pageContent.html;
  } else {
    return pageContent.content;
  }
  
}

export const useContent = (content_id: string, format: string) => {
  return useQuery({
    queryKey: ['content', content_id, format],
    queryFn: () => fetchContent(content_id, format),
  });
}


export default DynamicContent;
