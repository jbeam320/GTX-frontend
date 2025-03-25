export const connectExtension = async () => {
  const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");

  const extensions = await web3Enable("my-dapp");
  if (extensions.length === 0) {
    return false;
  }

  const accounts = await web3Accounts();
  if (accounts.length > 0) {
    return { address: accounts[0].address, type: "polkadot" };
  }
};
