"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreTable } from "@/components/stores/store-table";
import { useAllStores, useStores } from "@/lib/hooks/use-stores";
import { useCountryCodes } from "@/lib/hooks/use-country-codes";
import { CountryCodeSettingsDialog } from "@/components/stores/country-code-settings-dialog";
import type { Store } from "@/lib/types/store";

function StoreListByCountry({
  countryCode,
  search,
}: {
  countryCode: string;
  search: string;
}) {
  const { data: stores, isLoading, isError } = useStores(countryCode);
  return (
    <StoreListContent stores={stores} isLoading={isLoading} isError={isError} search={search} />
  );
}

function StoreListAll({ search }: { search: string }) {
  const { data: stores, isLoading, isError, loadedCount, total } = useAllStores();
  return (
    <StoreListContent
      stores={stores}
      isLoading={isLoading}
      isError={isError}
      search={search}
      loadingLabel={isLoading ? `국가별 조회 중... (${loadedCount}/${total})` : undefined}
    />
  );
}

function StoreListContent({
  stores,
  isLoading,
  isError,
  search,
  loadingLabel,
}: {
  stores?: Store[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  loadingLabel?: string;
}) {
  const filtered = stores?.filter(
    (s) =>
      !search ||
      s.store_name.toLowerCase().includes(search.toLowerCase()) ||
      s.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isLoading && (
        <div className="space-y-2">
          {loadingLabel && <p className="text-sm text-muted-foreground">{loadingLabel}</p>}
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          매장 목록을 불러오는데 실패했습니다.
        </div>
      )}
      {filtered && !isLoading && (
        <>
          {search && (
            <p className="text-sm text-muted-foreground">
              "{search}" 검색 결과: {filtered.length}개
            </p>
          )}
          <StoreTable stores={filtered} />
        </>
      )}
    </>
  );
}

export default function StoresPage() {
  const [countryCode, setCountryCode] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { allCodes } = useCountryCodes();

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">매장 관리</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            title="국가 코드 설정"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/stores/new">+ 매장 등록</Link>
          </Button>
        </div>
      </div>

      <CountryCodeSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {allCodes.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="매장명 또는 주소 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
      </div>

      {countryCode === "all" ? (
        <StoreListAll search={search} />
      ) : (
        <StoreListByCountry countryCode={countryCode} search={search} />
      )}
    </main>
  );
}
