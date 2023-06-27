import { initWallet } from "./wallet.js"
import { getSomeRealSh } from "./blockchain.js"
import { fillInPageInfo } from "./view.js"
import { verifyUser, verifyInviter, verifyVerify } from "./verify.js";

const tonConnectUI = initWallet()

tonConnectUI.connectionRestored.then(async (restored) => {
  if (restored) {
    verifyVerify(tonConnectUI.wallet.account.address)
  } else {
    verifyInviter()
  }
})

const unsubscribe = tonConnectUI.onStatusChange(
  async (walletInfo) => {
    const userAddress = walletInfo?.account?.address

    await verifyUser(userAddress)
  }
)

const values = await getSomeRealSh()
fillInPageInfo(values)