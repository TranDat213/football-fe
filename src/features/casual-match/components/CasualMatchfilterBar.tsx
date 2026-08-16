import { ActiveFilters } from "@/components/filter/Activefilters";
import { LocationOption } from "@/components/filter/Locationfilter";
import { UseCasualMatchFiltersReturn } from "../useCSMatchFilter";

interface CasualMatchFiterBarProps{
    casual: UseCasualMatchFiltersReturn;
    districts: LocationOption[];
    className?: string;
}
export function CasualMatchFiterBar({casual,districts,className=''}: CasualMatchFiterBarProps){
    const chips = [
        casual.filters.district && {
            key: ' district',
            label: `Quận: ${districts.find((d) => d.value=== casual.filters.district)?.label ?? casual.filters.district}`,
        },
    ].filter(Boolean) as {key:string; label: string}[];

    return(
        <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select 
            value={casual.filters.district}
            onChange={(e) => casual.setDistrict(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">

        </select>
      </div>
      {chips.length > 0 && (
        <ActiveFilters chips={chips} onRemove={(key) => casual.clearOne(key as keyof typeof casual.filters)} onClearAll={casual.clearAll}/>
      )}
      </div>
    )
}