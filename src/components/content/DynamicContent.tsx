import { useQuery } from '@tanstack/react-query';
import { ComponentMap } from './Components';

const DynamicContent = async ({  pageContent, format }: {  pageContent: string, format: string }) => {
  //return pageContent;
  if (format === "html") {
    return (
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    );
  } else {
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
  
  //return pageContent;
}

export const useContent = (content_id: string, format: string) => {
  return useQuery({
    queryKey: ['content', content_id, format],
    queryFn: () => fetchContent(content_id, format),
  });
}


// async function getToken() {
//   const clientid = process.env.CLIENTID;
//   const clientsecret = process.env.CLIENTSECRET;
//   if (!clientid || !clientsecret) {
//     throw new Error('CLIENTID and CLIENTSECRET must be defined in environment variables');
//   }
//   // Create URLSearchParams for form-encoded data
//   const data = new URLSearchParams({
//     'grant_type': 'client_credentials',
//     'client_id': clientid,
//     'client_secret': clientsecret
//   } as Record<string, string>);
//   // Using fetch to make the POST request
//   const url = process.env.API_BASE_URL;
//   const response = await fetch(`${url}/oauth/access_token`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Accept': 'application/json'
//     },
//     body: data // Send the form-encoded data in the body
//   })
//   if (!response.ok) {
//     throw new Error(`Error: ${response.status}`);
//   }
//   const results = await response.json();
//   return results.access_token;
// }

// const fetchContent = async (content_id: string, format: string = "html") => {
//   // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/content?content_id=` + content_id);
//   // if (!response.ok) {
//   //   throw new Error(`Error: ${response.status}`);
//   // }
  
//   const token = await getToken();
//   const base_url = process.env.API_BASE_URL;
//   const url_str = `${base_url}/v2/extensions/store-content?filter=like(content_id,${content_id})`;
//   const response = await fetch(
//     url_str,
//     {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       //cache: 'no-store',
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Error: ${response.status}`);
//   }
//   const { data } = await response.json();
//   console.log(`data: ${data}`);
//   // if data.data is not empty, then return the first entry   
//   const pageContent = data.length > 0 ? data[0] : null;
//   console.log(`pageContent: ${pageContent}`);
//   if (!pageContent) {
//     return null;
//   }
//   if (format === "html") {
//     return pageContent.html;
//   } else {
//     return pageContent.content;
//   }
//   //return Response.json(pageContent);
// }


export default DynamicContent;
