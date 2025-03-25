import { connectExtension } from "./wallet.service";
import { useWalletStore } from "./wallet.store";

export const useConnectWallet = () => {
  const setWalletAddress = useWalletStore((state) => state.setWalletAddress);

  const connect = async () => {
    const extensionConnection = await connectExtension();

    if (!extensionConnection) {
      alert("Error connecting to extension");
      console.error("Error connecting to extension");
      return;
    }

    const { address } = extensionConnection;
    setWalletAddress(address);
  };

  const disconnect = async () => {
    setWalletAddress(null);
  };

  return { connect, disconnect };
};
