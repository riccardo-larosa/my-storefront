// import Blurb from "../../../components/shared/blurb";
import DynamicContent, {fetchContent} from "../../../components/content/DynamicContent";

export default async function About() {
  
  const pageContent = await fetchContent("about_us", "react");
  return <DynamicContent  pageContent={pageContent} format="react" />;
  
}
