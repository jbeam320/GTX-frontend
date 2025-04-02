"use client";

import { useEffect, useState } from "react";
import SubnetSelector from "../components/complex/SubnetSelector";
import { Token } from "../utils/types";
import { TaoInput } from "../components/base";
import { ConfirmButton } from "../components/base/ConfirmButton";
import { useWalletStore } from "../store";
import { useSubnet } from "../hooks";
import { subnets } from "../utils/data";
import { PLANCK_PER_TAO } from "../utils/constants";

const ROOT_TOKEN: Token = {
  symbol: "TAO",
  subnetName: "ROOT",
  netuid: 0,
  balance: "0",
  isStaked: false,
  price: 1,
};

const SwapPanel = () => {
  const { getValidatorStake, walletBalance, selectedValidator } =
    useWalletStore();

  // const { subnets } = useSubnet();

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("0");
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [isSelectingFrom, setSelectingFrom] = useState(true);
  const [isChartVisible, setChartVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchFromTokenBalance = async () => {
      if (fromToken?.netuid !== undefined) {
        const { isStaked, netuid } = fromToken;
        const subnet = subnets.find((subnet) => subnet.netuid === netuid);

        const balance = isStaked
          ? await getValidatorStake(selectedValidator, netuid)
          : walletBalance;
        const price = (subnet?.price ?? 0) / PLANCK_PER_TAO;

        setFromToken({ ...fromToken, balance, price });
      }
    };

    fetchFromTokenBalance();
  }, [fromToken?.netuid, subnets]);

  useEffect(() => {
    const fetchToTokenBalance = async () => {
      if (toToken?.netuid !== undefined) {
        const { isStaked, netuid } = toToken;
        const subnet = subnets.find((subnet) => subnet.netuid === netuid);

        const balance = isStaked
          ? await getValidatorStake(selectedValidator, netuid)
          : walletBalance;
        const price = (subnet?.price ?? 0) / PLANCK_PER_TAO;

        setToToken({ ...toToken, balance, price });
      }
    };

    fetchToTokenBalance();
  }, [toToken?.netuid, subnets]);

  const handleSubnetClick = (isFrom: boolean) => {
    setSelectingFrom(isFrom);
    setSelectorOpen(true);
  };

  const handleSelect = (token: Token) => {
    if (isSelectingFrom) {
      // If selecting FROM token, set selected token as FROM and TAO as TO
      setFromToken(token);
      setToToken({ ...ROOT_TOKEN, balance: walletBalance });
    } else {
      // If selecting TO token, set TAO as FROM and selected token as TO
      setFromToken({ ...ROOT_TOKEN, balance: walletBalance });
      setToToken(token);
    }
    setSelectorOpen(false);
  };

  const handleSwapToggle = () => {
    // Swap positions of subnet token and TAO
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handlePercentageClick = (percentage: number) => {
    if (!fromToken?.balance) return;
    const maxAmount = parseFloat(fromToken.balance);
    const newAmount = (maxAmount * percentage) / 100;
    setAmount(newAmount.toString());
  };

  const handleConfirm = async () => {
    if (!amount || !fromToken || !toToken) return;

    setIsProcessing(true);
    try {
      // Add your swap transaction logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      setIsSuccess(true);
      setAmount(""); // Clear amount after success

      setTimeout(() => setIsSuccess(false), 5000); // Match the 5 second duration from StakePanelContent
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled =
    isProcessing ||
    !amount ||
    !fromToken ||
    !toToken ||
    isNaN(+amount) ||
    +amount <= 0 ||
    +amount > +fromToken.balance;

  return (
    <div className="relative w-[360px] bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        {/* Swap Button (Overflowing at the top) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center">
          <button className="w-40 py-2 bg-black text-white text-sm rounded-full shadow-xl">
            SWAP
          </button>
        </div>

        <TaoInput
          size="lg"
          label="FROM"
          token={fromToken}
          value={amount}
          isSelectable
          onClick={() => handleSubnetClick(true)}
          onChange={setAmount}
          subLabel={fromToken?.symbol && "BALANCE"}
          balance={fromToken?.balance}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={handleSwapToggle}
            className="w-[120px] h-[48px] bg-gray-100 rounded-2xl relative flex items-center justify-between px-4"
          >
            <div
              className={`w-6 h-6 rounded-full ${
                fromToken?.symbol === "TAO" ? "bg-black" : "bg-gray-300"
              }`}
            />
            <div className="absolute left-1/2 -translate-x-1/2 text-gray-500 text-sm">
              ⟷
            </div>
            <div
              className={`w-6 h-6 rounded-full ${
                toToken?.symbol === "TAO" ? "bg-black" : "bg-gray-300"
              }`}
            />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handlePercentageClick(25)}
              className="px-2 py-1 rounded-full hover:bg-gray-200 text-sm"
            >
              25%
            </button>
            <button
              onClick={() => handlePercentageClick(50)}
              className="px-2 py-1 rounded-full hover:bg-gray-200 text-sm"
            >
              50%
            </button>
            <button
              onClick={() => handlePercentageClick(100)}
              className="px-2 py-1 rounded-full hover:bg-gray-200 text-sm"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      <TaoInput
        size="lg"
        label="TO"
        token={toToken}
        value={(
          (+amount * (fromToken?.price ?? 0)) /
          (toToken?.price ?? 0)
        ).toFixed(4)}
        isSelectable
        onClick={() => handleSubnetClick(false)}
        onChange={setAmount}
        subLabel={toToken?.symbol && "BALANCE"}
        balance={toToken?.balance}
      />

      <ConfirmButton
        isProcessing={isProcessing}
        isSuccess={isSuccess}
        isDisabled={isDisabled}
        onClick={handleConfirm}
        disabledText={"SELECT TOKENS"}
      />

      {/* View Chart button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setChartVisible(!isChartVisible)}
          className="border-2 border-yellow-400 text-yellow-500 text-sm px-5 py-2 rounded-full font-mono flex items-center gap-2 -mb-12 bg-white shadow-sm"
        >
          📈 VIEW CHART
        </button>
      </div>

      {isSelectorOpen && (
        <SubnetSelector
          onSelect={handleSelect}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default SwapPanel;
