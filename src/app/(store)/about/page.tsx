// import Blurb from "../../../components/shared/blurb";
import DynamicContent, { fetchContent } from "../../../components/content/DynamicContent";

export default async function About() {
  
  //const pageContent = await fetchContent("this_test", "html");
  return <DynamicContent  content_id="this_test" format="html" />;
}
