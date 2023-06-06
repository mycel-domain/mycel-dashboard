import React, { useEffect, useState } from "react";
import { useNetwork, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";
import { useDebounce } from "use-debounce";
import { Web3Button } from "@web3modal/react";
import { IgntButton } from "@ignt/react-library";
import { RegistryDomain, RegistryWalletRecordType } from "mycel-client-ts/mycel.registry/rest";
import { useRegistryDomain } from "../def-hooks/useRegistryDomain";
import { mainnet, polygon, goerli, polygonMumbai, gnosisChiado } from "wagmi/chains";

const getWalletAddr = (domain: RegistryDomain, recordType: RegistryWalletRecordType) => {
  if (!domain || !domain.walletRecords || !domain.walletRecords[recordType]) {
    return "";
  }
  return domain.walletRecords[recordType].value;
};

const getConnectedWalletRecordType = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return RegistryWalletRecordType.ETHEREUM_MAINNET;
    case polygon.id:
      return RegistryWalletRecordType.POLYGON_MAINNET;
    case goerli.id:
      return RegistryWalletRecordType.ETHEREUM_GOERLI;
    case polygonMumbai.id:
      return RegistryWalletRecordType.POLYGON_MUMBAI;
    case gnosisChiado.id:
      throw new Error("Not implemented yet");
    default:
      throw new Error(`Unknown chainId: ${chainId}`);
  }
};

export default function SendView() {
  const { chain } = useNetwork();
  const { registryDomain, isLoading: isLoadingRegistryDomain, updateRegistryDomain } = useRegistryDomain();
  const [domainName, setDomainName] = useState("");
  const [targetWalletRecordType, setTargetWalletRecordType] = useState(RegistryWalletRecordType.ETHEREUM_MAINNET);
  const [debouncedDomainName] = useDebounce(domainName, 500);
  const [to, setTo] = useState("");

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  });
  const { data, sendTransactionAsync } = useSendTransaction(config);

  const { isLoading: isLoadingTx, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    try {
      const chainId = chain?.id;
      if (!chainId) {
        return;
      }
      const walletRecordType = getConnectedWalletRecordType(chainId);
      setTargetWalletRecordType(walletRecordType);
    } catch (e) {
      // TODO If walletRecordType is invalid, show an error message
      console.log(e);
    }
  }, [chain]);

  useEffect(() => {
    if (registryDomain) {
      const walletAddr = registryDomain ? getWalletAddr(registryDomain, targetWalletRecordType) : "";
      setTo(walletAddr || "");
    } else {
      setTo("");
    }
  }, [registryDomain]);

  useEffect(() => {
    updateRegistryDomain(domainName)
      .then()
      .catch((e) => {
        console.error(e);
      });
  }, [debouncedDomainName]);

  return (
    <div className="w-3/4 mx-auto">
      <div className="m-4">
        <Web3Button />
      </div>
      <div className="flex-row m-4">
        <input
          className="mr-6 mt-2 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
          aria-label="Recipient"
          onChange={async (e) => {
            setDomainName(e.target.value);
          }}
          placeholder="Recipient Domain Name (e.g. your-name.cel)"
          value={domainName}
        />
        {to ? (
          <p className="m-2 text-sm text-gray-700">
            <span className="italic">{domainName}</span> on {targetWalletRecordType} is{" "}
            <span className="italic">{to}</span>.
          </p>
        ) : (
          <p className="m-2 text-sm text-red-500">
            <span className="italic">{domainName}</span> doesn&apos;t exists in registry on {targetWalletRecordType}.
          </p>
        )}
        <input
          className="mr-6 my-2 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
          aria-label="Amount (ether)"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Token Amount (e.g. 0.05)"
          value={amount}
        />

        <IgntButton
          className="mt-1 h-14 w-full"
          onClick={async () => {
            const res = await sendTransactionAsync?.();
            console.log("%o", res);
          }}
          busy={isLoadingTx || isLoadingRegistryDomain}
          disabled={isLoadingTx || isLoadingRegistryDomain || !sendTransactionAsync || !to || !amount}
        >
          {isLoadingTx ? "Sending..." : "Send"}
        </IgntButton>
        {isSuccess && (
          <div className="m-4">
            <p>
              Successfully sent {amount} ether to {to}
            </p>
            <p>TxHash: {data?.hash}</p>
          </div>
        )}
      </div>
    </div>
  );
}
