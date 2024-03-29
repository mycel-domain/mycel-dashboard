import { useState, useEffect } from "react";
import { useClient } from "@/hooks/useClient";
import { RegistryRecord, RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import { Domain } from "@/types/domain";

export const useMycelResolver = () => {
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [mycelRecords, setMycelRecord] = useState<Record<string, RegistryRecord> | undefined>(undefined);
  const [mycelRecordsLength, setMycelRecordLength] = useState<number>(0);

  const updateMycelRecords = async (domain: Domain) => {
    setIsLoading(true);
    try {
      const record = await client.MycelResolver.query.queryAllRecords(domain.name, domain.parent);
      setMycelRecord(record.data.values || undefined);
    } catch (e) {
      console.error(e);
      setMycelRecord(undefined);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const getWalletAddr = (recordType: RegistryNetworkName) => {
    if (!mycelRecords || !mycelRecords[recordType] || !mycelRecords[recordType].walletRecord) {
      return "";
    } else {
      return mycelRecords[recordType].walletRecord?.value;
    }
  };

  useEffect(() => {
    if (!!mycelRecords) {
      setMycelRecordLength(Object.keys(mycelRecords).length);
    }
  }, [mycelRecords]);

  return {
    isLoading,
    mycelRecords,
    mycelRecordsLength,
    updateMycelRecords,
    getWalletAddr,
  };
};
