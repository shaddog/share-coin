export const initWallet = () => {
  return window.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://share.fra1.cdn.digitaloceanspaces.com/manifest.json',
    buttonRootId: 'connectWallet',
    uiPreferences: {
      theme: 'DARK',
      borderRadius: 's'
    }
  })
}

export const getShareTransaction = async (refAddr) => {
  if (!tonConnectUI.wallet) {
    return await tonConnectUI.connectWallet()
  }
  const transaction = {
    validUntil: Date.now() + 1000000000,
    messages: [
      {
        address: refAddr,
        amount: "10000000000"
      },
    ]
  }

  try {
    const result = await tonConnectUI.sendTransaction(transaction);

    setTimeout(() => {window.location.reload()}, 1000)
    // you can use signed boc to find the transaction 
    // console.log(result)
    // const someTxData = await tonweb.getTransactions(result.boc);
    // console.log(someTxData)
    // alert('Transaction was sent successfully', someTxData);
  } catch (e) {
      console.error(e);
  }
}