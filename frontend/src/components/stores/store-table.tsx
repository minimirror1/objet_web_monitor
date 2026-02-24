"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/format";
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "@/lib/utils/constants";
import type { Store } from "@/lib/types/store";

interface StoreTableProps {
  stores: Store[];
}

export function StoreTable({ stores }: StoreTableProps) {
  const router = useRouter();

  if (stores.length === 0) {
    return (
      <div className="rounded-md border bg-card py-12 text-center text-sm text-muted-foreground">
        등록된 매장이 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>매장명</TableHead>
            <TableHead>국가</TableHead>
            <TableHead>주소</TableHead>
            <TableHead>타임존</TableHead>
            <TableHead>등록일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow
              key={store.id}
              className="cursor-pointer hover:bg-accent"
              onClick={() => router.push(`/stores/${store.id}`)}
            >
              <TableCell className="font-medium">{store.store_name}</TableCell>
              <TableCell>
                {(() => {
                  const country = COUNTRIES.find((c) => c.code === store.country_code);
                  return (
                    <Badge variant="outline" className="gap-1.5">
                      {country && (
                        <ReactCountryFlag countryCode={country.code} svg style={{ width: "1.1em", height: "0.85em" }} />
                      )}
                      {country ? `${country.code} ${country.name}` : store.country_code}
                    </Badge>
                  );
                })()}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">{store.address ?? "-"}</TableCell>
              <TableCell className="text-muted-foreground">{store.timezone ?? "-"}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatDateTime(store.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
