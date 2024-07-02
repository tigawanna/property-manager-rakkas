
import { usePageContext } from "rakkasjs";
import { getMonthlyBills, getOneMonthlyBill } from "../api/bills";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BillsPeriod } from "../components/parts/PeriodPicker";
import { pbTryCatchWrapper } from "@/lib/pb/utils";

export function useBillsQuery(period: BillsPeriod) {
  const page_ctx = usePageContext();
  const pb = page_ctx.locals.pb;

  const query = useSuspenseQuery({
    queryKey: ["monthly-bills", period],
    queryFn: () => pbTryCatchWrapper(getMonthlyBills(pb, period)),
  });
  // console.log("bills query", query);
  return query;
}
export function useOneBillQuery(params:{curr_bill:string,prev_bill:string}) {
  const page_ctx = usePageContext();
  const pb = page_ctx.locals.pb;

  const query = useSuspenseQuery({
    queryKey: ["monthly-bills", params],
    queryFn: () => pbTryCatchWrapper(getOneMonthlyBill(pb, params)),
  });
  // console.log("bills query", query);
  return query;
}
