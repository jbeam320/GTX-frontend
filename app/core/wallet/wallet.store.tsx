import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
  walletAddress: string | "";
  setWalletAddress: (address: string | "") => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletAddress: "",
      setWalletAddress: (address) => set({ walletAddress: address }),
    }),
    {
      name: "wallet-storage",
    }
  )
);
