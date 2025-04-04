"use client";

import { useEffect, useState } from "react";
import SubnetSelector from "../../ui/modals/SubnetSelector";
import { Token } from "../../../lib/types";
import { TaoInput } from "../../ui/inputs/TaoInput";
import { ConfirmButton } from "../../ui/buttons/ConfirmButton";
import { useWalletStore } from "../../../stores/store";
import { useSubnet } from "../../../hooks";
import { subnets } from "../../../lib/data";
import { PLANCK_PER_TAO } from "../../../lib/constants";
import TransactionPanel from "./TransactionPanel";
import Button from "../../ui/buttons/Button";
import ChartIcon from "/public/icons/chart.svg";
import CloseIcon from "/public/icons/close-small.svg";

const ROOT_TOKEN: Token = {
  symbol: "TAO",
  subnetName: "ROOT",
  netuid: 0,
  balance: "0",
  isStaked: false, // wallet balance
  price: 1,
};

const SwapPanel = () => {
  const {
    getValidatorStake,
    walletBalance,
    selectedValidator,
    stakeTx,
    unstakeTx,
  } = useWalletStore();

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

  const handleToTokenChange = (value: string) => {
    const amount = (+value * (toToken?.price ?? 0)) / (fromToken?.price ?? 0);
    setAmount(amount.toFixed(2));
  };

  const handleConfirm = async () => {
    if (!amount || !fromToken || !toToken) return;

    const taoAmount = +amount * fromToken.price;
    setIsProcessing(true);

    try {
      if (!fromToken.isStaked) {
        // stake
        await stakeTx(taoAmount, selectedValidator, toToken.netuid);
      } else {
        await unstakeTx(taoAmount, selectedValidator, fromToken.netuid);
      }

      setIsSuccess(true);
      setAmount(""); // Clear amount after success

      setTimeout(() => setIsSuccess(false), 5000); // Match the 5 second duration from StakePanelContent
    } catch (error: any) {
      console.error("Swap failed. Error details:", {
        message: error.message,
        error: error,
        stack: error.stack,
      });
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
    <div>
      <TransactionPanel
        topNode={
          <Button size="medium" isRounded={true} variant="dark" label="SWAP" />
        }
        bottomNode={
          <Button
            label="VIEW CHART"
            variant="primary"
            onClick={() => setChartVisible(!isChartVisible)}
            icon={isChartVisible ? <CloseIcon /> : <ChartIcon />}
            isRounded={true}
          />
        }
        childrens={
          <div className="flex flex-col gap-4">
            <TaoInput
              label="FROM"
              token={fromToken}
              value={amount}
              isSelectable
              onClick={() => handleSubnetClick(true)}
              onChange={handleToTokenChange}
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

            <TaoInput
              label="TO"
              token={toToken}
              value={amount}
              isSelectable
              onClick={() => handleSubnetClick(false)}
              onChange={handleToTokenChange}
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
          </div>
        }
      />

      {isSelectorOpen && (
        <SubnetSelector
          onSelect={handleSelect}
          onClose={() => setSelectorOpen(false)}
          subnets={subnets}
        />
      )}
    </div>
  );
};

export default SwapPanel;
