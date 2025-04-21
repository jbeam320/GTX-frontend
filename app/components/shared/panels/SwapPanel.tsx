"use client";

import { useEffect, useState } from "react";
import { useSubnets, useTaoPrice } from "../../../hooks";
import { PLANCK_PER_TAO } from "../../../lib/constants";
import { Subnet, Token } from "../../../lib/types";
import { formatPrice } from "../../../lib/utils/format";
import { useWalletStore } from "../../../stores/store";
import { ConfirmButton } from "../../ui/buttons";
import Button from "../../ui/buttons/Button";
import SwapButton from "../../ui/buttons/SwapButton";
import { TransactionDetail } from "../../ui/cards";
import { TaoInput } from "../../ui/inputs/TaoInput";
import SubnetSelector from "../../ui/modals/SubnetSelector";
import TransactionPanel from "./TransactionPanel";
import ChartIcon from "/public/icons/chart.svg";
import CloseIcon from "/public/icons/close-small.svg";

const ROOT_TOKEN: Token = {
  symbol: "TAO",
  subnetName: "root",
  netuid: 0,
  balance: "0",
  isStaked: false, // wallet balance
  price: 1,
};

interface SwapPanelProps {
  onToggleChart: () => void;
  isChartVisible: boolean;
}

const SwapPanel = ({ onToggleChart, isChartVisible }: SwapPanelProps) => {
  const {
    getValidatorStake,
    walletBalance,
    selectedValidator,
    stakeTx,
    unstakeTx,
  } = useWalletStore();

  const { subnets } = useSubnets();
  const { taoPrice } = useTaoPrice();

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [isSelectingFrom, setSelectingFrom] = useState(true);
  const [isNewSelection, setIsNewSelection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isNewSelection || walletBalance) {
      fetchFromTokenBalance();
      fetchToTokenBalance();
    }
    setIsNewSelection(false); // Reset the new selection flag after fetching balance
  }, [isNewSelection, walletBalance, selectedValidator]);

  const fetchToTokenBalance = async () => {
    if (toToken?.netuid !== undefined) {
      const { isStaked, netuid } = toToken;
      const subnet = subnets.find((subnet: Subnet) => subnet.netuid === netuid);

      const balance = isStaked
        ? await getValidatorStake(selectedValidator.hotkey, netuid)
        : walletBalance;
      const price = (subnet?.price ?? 0) / PLANCK_PER_TAO;

      setToToken({
        ...toToken,
        balance: isStaked ? formatPrice(+balance, null, 2) : balance,
        price,
      });
    }
  };

  const fetchFromTokenBalance = async () => {
    if (fromToken?.netuid !== undefined) {
      const { isStaked, netuid } = fromToken;
      const subnet = subnets.find((subnet: Subnet) => subnet.netuid === netuid);

      const balance = isStaked
        ? await getValidatorStake(selectedValidator.hotkey, netuid)
        : walletBalance;
      const price = (subnet?.price ?? 0) / PLANCK_PER_TAO;

      setFromToken({
        ...fromToken,
        balance: isStaked ? formatPrice(+balance, null, 2) : balance,
        price,
      });
    }
  };

  const handleSubnetClick = (isFrom: boolean) => {
    setSelectingFrom(isFrom);
    setSelectorOpen(true);
  };

  const handleSelect = (token: Token) => {
    setIsNewSelection(true);

    if (isSelectingFrom) {
      setFromToken({ ...token, isStaked: true });
      setToToken({ ...ROOT_TOKEN, balance: walletBalance });
    } else {
      setFromToken({ ...ROOT_TOKEN, balance: walletBalance });
      setToToken({ ...token, isStaked: true });
    }

    setSelectorOpen(false);
  };

  const handleSwapToggle = () => {
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

  const handleFromTokenChange = (value: string) => {
    setAmount(value);
  };

  const handleConfirm = async () => {
    if (!amount || !fromToken || !toToken) return;

    const taoAmount = +amount;
    setIsProcessing(true);

    try {
      const { hotkey } = selectedValidator;
      if (!fromToken.isStaked) {
        // stake
        await stakeTx(taoAmount, hotkey, toToken.netuid);
      } else {
        await unstakeTx(taoAmount, hotkey, fromToken.netuid);
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

  const toTokenAmount = (
    (+amount * (fromToken?.price ?? 0)) /
    (toToken?.price ?? 0)
  ).toFixed(2);

  return (
    <div>
      <TransactionPanel
        topNode={
          <Button size="medium" isRounded={true} variant="dark" label="SWAP" />
        }
        bottomNode={
          <Button
            label={isChartVisible ? "ClOSE CHART" : "VIEW CHART"}
            variant={isChartVisible ? "secondary" : "primary"}
            onClick={onToggleChart}
            icon={isChartVisible ? <CloseIcon /> : <ChartIcon />}
            isRounded={true}
          />
        }
        childrens={
          <div className="flex flex-col gap-[33px]">
            <TaoInput
              label="FROM"
              token={fromToken}
              value={amount}
              isSelectable
              onClick={() => handleSubnetClick(true)}
              onChange={handleFromTokenChange}
              subLabel={fromToken?.symbol && "BALANCE"}
              balance={fromToken?.balance}
              isStaked={fromToken?.isStaked}
            />

            <div className="flex items-center justify-between">
              <SwapButton
                isFromStaked={fromToken?.isStaked}
                onClick={handleSwapToggle}
              />

              <div className="flex gap-2">
                {[25, 50, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handlePercentageClick(percentage)}
                    className="p-[12px] rounded-[16px] cursor-pointer hover:bg-gray-200 text-[16px] font-mono"
                  >
                    {percentage === 100 ? "MAX" : `${percentage}%`}
                  </button>
                ))}
              </div>
            </div>

            <TaoInput
              label="TO"
              token={toToken}
              value={toTokenAmount}
              isSelectable
              onClick={() => handleSubnetClick(false)}
              onChange={handleToTokenChange}
              subLabel={toToken?.symbol && "BALANCE"}
              balance={toToken?.balance}
              errorIgnore={true}
              isStaked={toToken?.isStaked}
            />

            <TransactionDetail
              tokenAmount={toToken?.isStaked ? amount : toTokenAmount}
              alphaAmount={toToken?.isStaked ? toTokenAmount : amount}
              isFromAlpha={fromToken?.isStaked}
              usdAmount={
                toToken?.isStaked
                  ? (+amount * taoPrice?.price).toFixed(2)
                  : (+toTokenAmount * taoPrice?.price).toFixed(2)
              }
              isShow={!isDisabled || isProcessing}
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
