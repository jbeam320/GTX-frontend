import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
  walletAddress: string | "";
  walletBalance: string;
  stakedBalance: string;
  selectedValidator: string;
  setWalletAddress: (address: string | "") => void;
  setWalletBalance: (balance: string) => void;
  setStakedBalance: (balance: string) => void;
  setSelectedValidator: (validator: string) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletAddress: "",
      walletBalance: "0",
      stakedBalance: "0",
      selectedValidator: "5FFApaS75bv5pJHfAp2FVLBj9ZaXuFDjEypsaBNc1wCfe52v", // Default validator
      setWalletAddress: (address) => set({ walletAddress: address }),
      setWalletBalance: (balance) => set({ walletBalance: balance }),
      setStakedBalance: (balance) => set({ stakedBalance: balance }),
      setSelectedValidator: (validator) =>
        set({ selectedValidator: validator }),
    }),
    {
      name: "wallet-storage",
    }
  )
);
