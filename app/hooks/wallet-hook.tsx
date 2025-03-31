import { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useWalletStore } from "../store";
import { PLANCK_PER_TAO } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import * as services from "../services";
import { InjectedExtension } from "@polkadot/extension-inject/types";

export const useWallet = () => {
  const {
    walletAddress,
    selectedValidator,
    setWalletAddress,
    setWalletBalance,
    setStakedBalance,
  } = useWalletStore((state) => state);

  const [loading_balances, setBalanceLoading] = useState<boolean>(false);
  const [validatorStake, setValidatorStake] = useState<string>("0");
  const [loading_validatorStake, setLoading_validatorStake] =
    useState<boolean>(true);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [extension, setExtension] = useState<InjectedExtension | null>(null);

  // Initialize extension on mount
  useEffect(() => {
    setupExtension();
    return () => {
      // Cleanup extension listeners if needed
      const extensionProvider = (extension as any)?.provider;
      if (extensionProvider?.removeAllListeners) {
        extensionProvider.removeAllListeners();
      }
    };
  }, []);

  useEffect(() => {
    let unsubscribe = false;

    const initApi = async () => {
      try {
        const newApi = await setupApiConnection();

        if (newApi && walletAddress && !unsubscribe) {
          setBalanceLoading(true);
          await fetchWalletBalance(walletAddress, newApi);
          await fetchStakedBalance(walletAddress, newApi);
          setBalanceLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize API:", error);
      }
    };

    initApi();

    return () => {
      unsubscribe = true;
      if (api) {
        api.disconnect();
        setApi(null);
      }
    };
  }, [walletAddress]);

  useEffect(() => {
    const loadValidatorStake = async () => {
      if (selectedValidator) {
        try {
          if (!api || !walletAddress) return;

          setLoading_validatorStake(true);

          const info: any =
            await api.call.stakeInfoRuntimeApi.getStakeInfoForHotkeyColdkeyNetuid(
              selectedValidator,
              walletAddress,
              0
            );

          setValidatorStake(
            (
              Number(info.toHuman().stake.toString().replace(/,/g, "")) /
              Number(PLANCK_PER_TAO)
            ).toFixed(2)
          );

          setLoading_validatorStake(false);
        } catch (error) {
          console.error("Error getting validator stake:", error);
        } finally {
          setLoading_validatorStake(false);
        }
      }
    };
    loadValidatorStake();
  }, [selectedValidator, api, walletAddress]);

  // Create a reusable setup function
  const setupApiConnection = async (): Promise<ApiPromise | null> => {
    if (isConnecting) return null;
    setIsConnecting(true);

    try {
      const provider = new WsProvider(
        process.env.NEXT_PUBLIC_BITTENSOR_NODE_ENDPOINT,
        1000
      );

      const newApi = await ApiPromise.create({ provider });

      // Set up provider event handlers
      provider.on("connected", () => {
        console.log("Connected to the node");
        setIsConnecting(false);
      });

      provider.on("disconnected", () => {
        console.log("Disconnected from the node");
        setIsConnecting(false);
      });

      provider.on("error", (error) => {
        console.error("Connection error:", error);
        setIsConnecting(false);
      });

      await newApi.isReady;
      setApi(newApi);
      return newApi;
    } catch (error) {
      console.error("Error setting up API:", error);
      setIsConnecting(false);
      throw new Error("Failed to establish connection");
    }
  };

  // Setup extension connection
  const setupExtension = async () => {
    try {
      const { web3Enable, web3AccountsSubscribe } = await import(
        "@polkadot/extension-dapp"
      );

      // Use a more descriptive dApp name
      const extensions = await web3Enable("Bittensor Stake Manager");

      if (extensions.length === 0) {
        console.error("Bittensor extension not found");
        return null;
      }

      const injectedExtension = extensions[0];

      // Subscribe to account changes
      await web3AccountsSubscribe((accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        }
      });

      setExtension(injectedExtension);

      // Listen for extension events if available
      const extensionProvider = (injectedExtension as any).provider;
      if (extensionProvider?.on) {
        extensionProvider.on("disconnect", () => {
          console.log("Extension disconnected");
          disconnectWallet();
        });
      }

      return injectedExtension;
    } catch (error: any) {
      console.error("Error setting up extension:", error);
      if (error?.message?.includes("pending authorization")) {
        alert(
          "Please accept the authorization request in your Bittensor extension"
        );
      }
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      let currentExtension = extension;
      if (!currentExtension) {
        currentExtension = await setupExtension();
        if (!currentExtension) {
          alert("Bittensor extension not found");
          return;
        }
      }

      const accounts = await currentExtension.accounts.get();

      if (accounts.length === 0) {
        console.error("No accounts found");
        return;
      }

      setWalletAddress(accounts[0].address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear state variables related to wallet info
      setWalletAddress("");
      setWalletBalance("0");
      setStakedBalance("0");
      setBalanceLoading(true);
      if (api) {
        api.disconnect();
        setApi(null);
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const fetchWalletBalance = async (userAddress: string, api: ApiPromise) => {
    try {
      console.log("Fetching wallet balance for address:", userAddress);
      const accountData = await api.query.system.account(userAddress);

      const rawBalance = (accountData as any).data.free.toBigInt();

      const balanceInTao = Number(rawBalance) / Number(PLANCK_PER_TAO);
      const formattedBalance = balanceInTao.toFixed(2);

      console.log("Balance in TAO:", formattedBalance);

      // Update balance in the store instead of local state
      setWalletBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchStakedBalance = async (userAddress: string, api: ApiPromise) => {
    try {
      const infos: any[] =
        await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(userAddress);

      // Calculate total staked balance for root subnet
      const stakes =
        infos?.filter((info) => info.netuid.toString() === "0") ?? [];
      const totalStaked = stakes?.reduce((total: number, curr: any) => {
        return total + Number(curr.stake.toString().replace(/,/g, ""));
      }, 0);

      const formattedBalance = (totalStaked / PLANCK_PER_TAO).toFixed(2);
      console.log("Total staked balance in TAO:", formattedBalance);
      setStakedBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching total staked balance:", error);
      setStakedBalance("0");
    }
  };

  const stakeTx = async (validator: string, amount: number) => {
    if (!walletAddress) throw new Error("wallet address not found");
    if (!api) throw new Error("API not initialized");
    if (!extension) throw new Error("Extension not connected");

    try {
      const { web3FromAddress } = await import("@polkadot/extension-dapp");
      const account = await web3FromAddress(walletAddress);

      if (!account) throw new Error("Account not found");

      const stakeTx = api.tx.subtensorModule.addStake(validator, 0, amount);

      return new Promise((resolve, reject) => {
        let unsub: any;

        try {
          stakeTx
            .signAndSend(
              walletAddress,
              {
                signer: account.signer,
                withSignedTransaction: !0,
              },
              async (result) => {
                const { dispatchError, isInBlock, isFinalized } = result;

                if (dispatchError) {
                  console.error(
                    "Transaction failed:",
                    dispatchError.toString()
                  );
                  if (unsub) unsub();
                  reject(dispatchError);
                  return;
                }

                if (isFinalized) {
                  console.log("Transaction finalized, refreshing balances...");
                  try {
                    // Wait a moment for chain state to update
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await fetchWalletBalance(walletAddress, api);
                    await fetchStakedBalance(walletAddress, api);
                    if (unsub) unsub();
                    resolve(result.txHash.toString());
                  } catch (error) {
                    console.error("Error refreshing balances:", error);
                    if (unsub) unsub();
                    reject(error);
                  }
                }
              }
            )
            .then((handler) => {
              unsub = handler;
            })
            .catch((error) => {
              console.error("Failed to subscribe:", error);
              reject(error);
            });
        } catch (error) {
          if (unsub) unsub();
          throw error;
        }
      });
    } catch (error: any) {
      console.error("Error in stakeTx:", error);
      if (error?.message?.includes("disconnected")) {
        await disconnectWallet();
      }
      throw error;
    }
  };

  const unstakeTx = async (validator: string, amount: number) => {
    if (!walletAddress) throw new Error("wallet address not found");
    if (!extension) throw new Error("Extension not connected");

    // Ensure we have a valid API connection
    let currentApi = api;
    if (!currentApi?.isConnected) {
      console.log("API not connected, attempting to reconnect...");
      currentApi = await setupApiConnection();
    }

    if (!currentApi) throw new Error("Failed to establish API connection");

    try {
      const { web3FromAddress } = await import("@polkadot/extension-dapp");
      const account = await web3FromAddress(walletAddress);

      if (!account) throw new Error("Account not found");

      const unstakeTx = currentApi.tx.subtensorModule.removeStake(
        validator,
        0,
        amount
      );

      return new Promise((resolve, reject) => {
        unstakeTx.signAndSend(
          walletAddress,
          {
            signer: account.signer,
          },
          async (result) => {
            const { dispatchError, isInBlock, isFinalized } = result;

            if (dispatchError) {
              console.error("Transaction failed:", dispatchError.toString());
              reject(dispatchError);
              return;
            }

            if (isFinalized) {
              console.log("Transaction finalized, refreshing balances...");
              try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await fetchWalletBalance(walletAddress, currentApi);
                await fetchStakedBalance(walletAddress, currentApi);
                resolve(result.txHash.toString());
              } catch (error) {
                console.error("Error refreshing balances:", error);
                reject(error);
              }
            }
          }
        );
      });
    } catch (error: any) {
      console.error("Error in unstakeTx:", error);
      if (error?.message?.includes("disconnected")) {
        await disconnectWallet();
      }
      throw error;
    }
  };

  const {
    data: subnets,
    isLoading: loading_subnets,
    error: subnetsError,
  } = useQuery({
    queryKey: ["subnets"],
    queryFn: services.getSubnets,
  });

  const {
    data: taoPrice,
    isLoading: loading_taoPrice,
    error: taoPriceError,
  } = useQuery({
    queryKey: ["taoPrice"],
    queryFn: services.getTaoPrice,
  });

  return {
    walletAddress,
    subnets,
    taoPrice,
    validatorStake,
    loading_balances,
    loading_subnets,
    loading_taoPrice,
    loading_validatorStake,
    connectWallet,
    disconnectWallet,
    stakeTx,
    unstakeTx,
    setValidatorStake,
  };
};
