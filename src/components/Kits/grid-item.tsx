
import { ComboBoxes } from "./comboBoxes";
import { DscountedBundles } from "./discountedBundles";

export function GridItem({ cell }: any) {   
  return (
<>
<ComboBoxes cell={cell} />
{/* <DscountedBundles cell={cell} /> */}
</>
  );
}