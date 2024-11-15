import LinkCreateFoarm from "./createFoam";
import LinksTable from "./LinksTable";

export default function LinksPage() {
  return (
    <>
      <div className="text-center m-5 text-xl">
        <LinkCreateFoarm />
        <LinksTable />
      </div>
    </>
  );
}
