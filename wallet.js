const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://share.fra1.cdn.digitaloceanspaces.com/manifest.json',
  buttonRootId: 'connectWallet',
  uiPreferences: {
    theme: 'DARK',
    borderRadius: 's'
  }
});

const getShareTransaction = async (refAddr) => {
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

    // you can use signed boc to find the transaction 
    console.log(result)
    const someTxData = await tonweb.getTransactions(result.boc);
    console.log(someTxData)
    // alert('Transaction was sent successfully', someTxData);
  } catch (e) {
      console.error(e);
  }
}

const unsubscribe = tonConnectUI.onStatusChange(
  async (walletInfo) => {
    const refContract = await getRefAddress(walletInfo.account.address)
    const isRefContractActive = await areYouIn(refContract)

    if(refContract && isRefContractActive) {
      showUserRefContract(refContract)
    }
  }
)