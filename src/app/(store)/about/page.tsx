import Blurb from "../../../components/shared/blurb";
import DynamicContent, { fetchContent } from "../../../components/content/DynamicContent";

export default async function About() {
  //return <Blurb title="About" />;
  const pageContent = await fetchContent("about_us", "about");
  return <DynamicContent  pageContent={pageContent} />;
}
