import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletAddress: null,
      setWalletAddress: (address) => set({ walletAddress: address }),
    }),
    {
      name: "wallet-storage",
    }
  )
);
