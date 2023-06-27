// 1. init wallet and tonconnectui
// 2. load data from contract
// 3. DOMContentLoaded and fill contract data into
import { initWallet } from "./wallet.js"
import { getSomeRealSh, rawAddressToFriendly } from "./blockchain.js"
import { fillInPageInfo } from "./view.js"
import { verifyUser, verifyInviter } from "./verify.js";

const tonConnectUI = initWallet()

tonConnectUI.connectionRestored.then(async (restored) => {
  if (restored) {
    // const userAddress = tonConnectUI.wallet.account.address
    // const userFriendlyAddress = rawAddressToFriendly(userAddress)
    // console.log(userFriendlyAddress)
    // await verifyInviter()
  } else {
    verifyInviter()
  }
});

const unsubscribe = tonConnectUI.onStatusChange(
  async (walletInfo) => {
    const userAddress = walletInfo.account.address

    await verifyUser(userAddress)
  }
)

const values = await getSomeRealSh()
fillInPageInfo(values)