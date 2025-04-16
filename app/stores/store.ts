import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PLANCK_PER_TAO, defaultValidator } from "../lib/constants";

// Separate interface for persisted state
interface PersistedState {
  walletAddress: string;
  walletBalance: string;
  stakedBalance: string;
  selectedValidator: { hotkey: string; name: string };
  validatorStake: string;
  shouldReconnect: boolean;
}

interface WalletState extends PersistedState {
  api: ApiPromise | null;
  isInitialized: boolean;
  extension: InjectedExtension | null;

  // API functions
  setupApiConnection: () => Promise<ApiPromise | null>;
  setupExtension: () => Promise<InjectedExtension | null>;
  fetchWalletBalance: (userAddress: string, api: ApiPromise) => Promise<void>;
  fetchStakedBalance: (userAddress: string, api: ApiPromise) => Promise<void>;
  getValidatorStake: (validator: string, netuid: number) => Promise<string>;
  getStakedBalanceForSubnet: (netuid: string) => Promise<string>;
  stakeTx: (
    amount: number,
    validator: string,
    netuid: number
  ) => Promise<string>;
  unstakeTx: (
    amount: number,
    validator: string,
    netuid: number
  ) => Promise<string>;
  batchSell: (
    txsInfo: { netuid: number; amount: number; validator: string }[]
  ) => Promise<void>;
  batchSellAndBuy: (
    txsInfo: {
      netuid: number;
      amount: number;
      type: "sell" | "buy";
      validator: string;
    }[]
  ) => Promise<void>;

  // Setters
  setWalletAddress: (address: string) => void;
  setWalletBalance: (balance: string) => void;
  setStakedBalance: (balance: string) => void;
  setSelectedValidator: (validator: { hotkey: string; name: string }) => void;
  setApi: (api: ApiPromise | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setExtension: (extension: InjectedExtension | null) => void;
  setValidatorStake: (stake: string) => void;

  // Modified connectWallet
  connectWallet: () => Promise<void>;

  // Modified disconnectWallet
  disconnectWallet: () => Promise<void>;

  // Add new reconnect function
  reconnectWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Persisted state
      walletAddress: "",
      walletBalance: "0",
      stakedBalance: "0",
      selectedValidator: defaultValidator,
      validatorStake: "0",
      shouldReconnect: false,

      // Non-persisted state
      api: null,
      isInitialized: false,
      extension: null,

      // Setters
      setWalletAddress: (address) => set({ walletAddress: address }),
      setWalletBalance: (balance) => set({ walletBalance: balance }),
      setStakedBalance: (balance) => set({ stakedBalance: balance }),
      setSelectedValidator: (validator) =>
        set({ selectedValidator: validator }),
      setValidatorStake: (stake) => set({ validatorStake: stake }),

      setApi: (api) => set({ api }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
      setExtension: (extension) => set({ extension }),

      // API functions
      setupApiConnection: async () => {
        const { isInitialized, setIsInitialized, setApi } = get();
        setIsInitialized(true);

        try {
          const provider = new WsProvider(
            process.env.NEXT_PUBLIC_BITTENSOR_NODE_ENDPOINT,
            1000
          );

          const newApi = await ApiPromise.create({ provider });
          // Set up provider event handlers
          provider.on("connected", () => {
            console.log("Connected to the node");
          });

          provider.on("disconnected", () => {
            console.log("Disconnected from the node");
          });

          provider.on("error", (error) => {
            console.error("Connection error:", error);
          });

          await newApi.isReady;
          setApi(newApi);
          return newApi;
        } catch (error) {
          console.error("Error setting up API:", error);
          throw new Error("Failed to establish connection");
        }
      },

      setupExtension: async () => {
        const { setExtension, disconnectWallet } = get();
        try {
          const { web3Enable, web3AccountsSubscribe } = await import(
            "@polkadot/extension-dapp"
          );

          const extensions = await web3Enable("my-dapp");

          if (extensions.length === 0) {
            console.error("Bittensor extension not found");
            return null;
          }

          const injectedExtension = extensions[0];

          await web3AccountsSubscribe((accounts) => {
            if (accounts.length === 0) {
              disconnectWallet();
            }
          });

          setExtension(injectedExtension);

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
      },

      connectWallet: async () => {
        const {
          extension,
          setupExtension,
          setWalletAddress,
          setupApiConnection,
          setSelectedValidator,
        } = get();
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
          setSelectedValidator(defaultValidator);
          set({ shouldReconnect: true });
          await setupApiConnection();
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      },

      disconnectWallet: async () => {
        const {
          setWalletAddress,
          setWalletBalance,
          setStakedBalance,
          setSelectedValidator,
          api,
          setApi,
        } = get();
        try {
          setWalletAddress("");
          setWalletBalance("0");
          setStakedBalance("0");
          setSelectedValidator(defaultValidator);
          set({ shouldReconnect: false });
          if (api) {
            api.disconnect();
            setApi(null);
          }
        } catch (error) {
          console.error("Error disconnecting wallet:", error);
        }
      },

      fetchWalletBalance: async (userAddress: string, api: ApiPromise) => {
        const { setWalletBalance } = get();
        try {
          console.log("Fetching wallet balance for address:", userAddress);
          const accountData = await api.query.system.account(userAddress);
          const rawBalance = (accountData as any).data.free.toBigInt();
          const balanceInTao = Number(rawBalance) / Number(PLANCK_PER_TAO);
          const formattedBalance = balanceInTao.toFixed(2);
          setWalletBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      },

      fetchStakedBalance: async (userAddress: string, api: ApiPromise) => {
        const { setStakedBalance, selectedValidator } = get();
        try {
          const infos: any[] =
            await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(
              userAddress
            );

          const stakes =
            infos?.filter(
              ({ netuid, hotkey }) =>
                netuid.toString() === "0" && hotkey === selectedValidator.hotkey
            ) ?? [];

          const totalStaked = stakes?.reduce((total: number, curr: any) => {
            return total + Number(curr.stake.toString().replace(/,/g, ""));
          }, 0);

          const formattedBalance = (totalStaked / PLANCK_PER_TAO).toFixed(2);
          setStakedBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching total staked balance:", error);
          setStakedBalance("0");
        }
      },

      getStakedBalanceForSubnet: async (netuid: string) => {
        const { walletAddress, api } = get();
        if (!api || !walletAddress) {
          console.error("API or wallet address not found");
          return "0";
        }

        try {
          const infos: any[] =
            await api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey(
              walletAddress
            );

          const stakes =
            infos?.filter((info) => info.netuid.toString() === netuid) ?? [];
          const totalStaked = stakes?.reduce((total: number, curr: any) => {
            return total + Number(curr.stake.toString().replace(/,/g, ""));
          }, 0);

          const formattedBalance = (totalStaked / PLANCK_PER_TAO).toFixed(2);
          return formattedBalance;
        } catch (error) {
          console.error("Error fetching staked balance for subnet:", error);
          return "0";
        }
      },

      stakeTx: async (
        amount: number,
        validator: string,
        netuid: number = 0
      ) => {
        console.log(netuid, amount);

        const {
          walletAddress,
          api,
          extension,
          disconnectWallet,
          fetchWalletBalance,
          fetchStakedBalance,
        } = get();
        if (!walletAddress) throw new Error("wallet address not found");
        if (!api) throw new Error("API not initialized");
        if (!extension) throw new Error("Extension not connected");

        try {
          const { web3FromAddress } = await import("@polkadot/extension-dapp");
          const account = await web3FromAddress(walletAddress);

          if (!account) throw new Error("Account not found");
          console.log(netuid, amount);

          const stakeTx = api.tx.subtensorModule.addStake(
            validator,
            netuid,
            amount * 1e9
          );

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
                    const { dispatchError, isFinalized } = result;

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
                      console.log(
                        "Transaction finalized, refreshing balances..."
                      );
                      try {
                        // await new Promise((resolve) =>
                        //   setTimeout(resolve, 2000)
                        // );
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
      },

      unstakeTx: async (
        amount: number,
        validator: string,
        netuid: number = 0
      ) => {
        const {
          walletAddress,
          api,
          extension,
          setupApiConnection,
          disconnectWallet,
          fetchWalletBalance,
          fetchStakedBalance,
        } = get();
        console.log(netuid, amount, validator);

        if (!walletAddress) throw new Error("wallet address not found");
        if (!extension) throw new Error("Extension not connected");

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
            netuid,
            amount * 1e9
          );

          return new Promise((resolve, reject) => {
            unstakeTx.signAndSend(
              walletAddress,
              {
                signer: account.signer,
                withSignedTransaction: !0,
              },
              async (result) => {
                const { dispatchError, isFinalized } = result;

                if (dispatchError) {
                  console.error(
                    "Transaction failed:",
                    dispatchError.toString()
                  );
                  reject(dispatchError);
                  return;
                }

                if (isFinalized) {
                  console.log("Transaction finalized, refreshing balances...");
                  try {
                    // await new Promise((resolve) => setTimeout(resolve, 1000));
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
      },

      batchSell: async (txsInfo) => {
        const { walletAddress, api, extension } = get();
        if (!walletAddress) throw new Error("wallet address not found");
        if (!api) throw new Error("API not initialized");
        if (!extension) throw new Error("Extension not connected");

        try {
          const { web3FromAddress } = await import("@polkadot/extension-dapp");
          const account = await web3FromAddress(walletAddress);

          if (!account) throw new Error("Account not found");

          const txs = txsInfo.map(({ netuid, amount, validator }) =>
            api.tx.subtensorModule.removeStake(validator, netuid, amount * 1e9)
          );
          const batchTx = api.tx.utility.batch(txs);

          const unsub = await batchTx.signAndSend(
            walletAddress,
            {
              signer: account.signer,
              withSignedTransaction: !0,
            },
            ({ status, events }) => {
              if (status.isInBlock) {
                console.log(
                  `Batch transaction included in block ${status.asInBlock}`
                );
              } else if (status.isFinalized) {
                console.log(
                  `Batch transaction finalized in block ${status.asFinalized}`
                );
                unsub();
              }
            }
          );
        } catch (error: any) {
          console.error("Transaction failed:", error);
        }
      },

      batchSellAndBuy: async (txsInfo) => {
        const { walletAddress, api, extension } = get();
        if (!walletAddress) throw new Error("wallet address not found");
        if (!api) throw new Error("API not initialized");
        if (!extension) throw new Error("Extension not connected");

        try {
          const { web3FromAddress } = await import("@polkadot/extension-dapp");
          const account = await web3FromAddress(walletAddress);

          if (!account) throw new Error("Account not found");

          const txs = txsInfo.map(({ netuid, amount, type, validator }) =>
            type === "sell"
              ? api.tx.subtensorModule.removeStake(
                  validator,
                  netuid,
                  amount * 1e9
                )
              : api.tx.subtensorModule.addStake(validator, netuid, amount * 1e9)
          );
          const batchTx = api.tx.utility.batch(txs);

          const unsub = await batchTx.signAndSend(
            walletAddress,
            {
              signer: account.signer,
              withSignedTransaction: !0,
            },
            ({ status, events }) => {
              if (status.isInBlock) {
                console.log(
                  `Batch transaction included in block ${status.asInBlock}`
                );
              } else if (status.isFinalized) {
                console.log(
                  `Batch transaction finalized in block ${status.asFinalized}`
                );
                unsub();
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      },

      getValidatorStake: async (validator: string, netuid: number = 0) => {
        const { walletAddress, api } = get();
        if (!api || !walletAddress) return "0";

        try {
          const info: any =
            await api.call.stakeInfoRuntimeApi.getStakeInfoForHotkeyColdkeyNetuid(
              validator,
              walletAddress,
              netuid
            );

          if (!info) return "0";

          // Handle different response formats
          const stake = info.toJSON ? info.toJSON().stake : info.stake;
          if (!stake) return "0";

          const stakeStr = stake.toString().replace(/,/g, "");
          const stakeValue = Number(stakeStr);
          const stakeInTao = stakeValue / Number(PLANCK_PER_TAO);
          const formattedStake = stakeInTao.toFixed(2);
          return formattedStake;
        } catch (error) {
          console.error("Error getting validator stake:", error);
          return "0";
        }
      },

      // Add new reconnect function
      reconnectWallet: async () => {
        const {
          shouldReconnect,
          walletAddress,
          setupExtension,
          setupApiConnection,
        } = get();

        if (!shouldReconnect || !walletAddress) return;

        try {
          const extension = await setupExtension();
          if (!extension) return;

          const accounts = await extension.accounts.get();
          if (!accounts.some((acc) => acc.address === walletAddress)) {
            await get().disconnectWallet();
            return;
          }

          await setupApiConnection();
        } catch (error) {
          console.error("Error reconnecting:", error);
        }
      },
    }),

    {
      name: "wallet-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        walletBalance: state.walletBalance,
        stakedBalance: state.stakedBalance,
        selectedValidator: state.selectedValidator,
        validatorStake: state.validatorStake,
        shouldReconnect: state.shouldReconnect,
      }),
    }
  )
);
