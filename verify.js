import { getRefAddress, areYouIn, rawAddressToFriendly } from "./blockchain.js"
import { showUserRef, showInviterRef } from "./view.js"

export const verifyUser = async (userAddress) => {
  const userFriendlyAddress = rawAddressToFriendly(userAddress)
  const userRefAddress = await getRefAddress(userAddress)
  const isUserRefActive = await areYouIn(userRefAddress)

  if(userRefAddress && isUserRefActive) {
    window.location.hash = userFriendlyAddress
    showUserRef(userRefAddress)
  }
}

export const verifyInviter = async () => {
  if(window.location.hash) {
    const inviterAddress = window.location.hash.split('#')[1]
    const inviterRefAddress = await getRefAddress(inviterAddress)
    const isInviterRefActive = await areYouIn(inviterRefAddress)
  
    if(inviterRefAddress && isInviterRefActive) {
      showInviterRef(inviterAddress, inviterRefAddress)
    }
  }
}

export const verifyVerify = async (userAddress) => {
  if(window.location.hash) {
    const inviterAddress = window.location.hash.split('#')[1]
    const inviterRefAddress = await getRefAddress(inviterAddress)
    const isInviterRefActive = await areYouIn(inviterRefAddress)

    const userRefAddress = await getRefAddress(userAddress)
    const isUserRefActive = await areYouIn(userRefAddress)

    if(userRefAddress && !isUserRefActive && isInviterRefActive) {
      showInviterRef(inviterAddress, inviterRefAddress)
    }
  }
}