import "dotenv/config"
import { PropertyTenantsResponse, Schema } from "@/lib/pb/database";
import PocketBase from "pocketbase";
import { TypedPocketBase } from "typed-pocketbase";

interface Options {
  from: keyof Schema;
  to: keyof Schema;
  keepId?: boolean;
}

interface Options {
//   from: PropertyTenantsResponse;
//   to: keyof Schema;
//   keepId?: boolean;
uwu:string;
}
//  properties of the 2 interfaces will be merged 
async function duplicateCollection() {
  const pb = new TypedPocketBase<Schema>(process.env.RAKKAS_PB_URL);
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASSWORD!,
  );
  const records = await pb.from("property_tenants").getFullList();
  pb.autoCancellation(false);
  const newRecords = records.map((record) => {
    pb.from("property_tenants_list").create({
        id: record.id,
        name: record.username
    });
  });
  await Promise.all(newRecords);
}

duplicateCollection()
.then(() => {
  console.log("done cloning collection");
})
.catch((err) => {
  console.log("error cloning collection", err);
});
