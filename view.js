const contractAddressSlice = (contractAddress) => {
  if(typeof contractAddress !== 'string' || contractAddress.length !== 48) {
    throw new Error('contractAddress should be string type and 48 symbols length')
  }
  
  return contractAddress.slice(0, 6) + '...' + contractAddress.slice(42, 48)
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}



document.addEventListener("DOMContentLoaded", async () => {
  // VALUES
  const values = await getSomeRealShit()
  const inviteContractAddress = localStorage.getItem("userRefAddressFriendly")
  
  // NODES
  const copyInviteContractButton = document.querySelector('#copyContractButton')
  const getShareButton = document.querySelector('#getShareButton')
  
  const fillInPageInfo = () => {
    console.log(values)
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        const value = values[key]

        try {
          const dataVars = document.querySelectorAll(`[data-var=${key}]`)
          dataVars.forEach(element => {
            element.textContent = formatNumber(value)
          })
        } catch (err) {
          console.error(err)
        }
      }
    }

    copyInviteContractButton.textContent = contractAddressSlice(inviteContractAddress) + ' ❐'
    strikeThroughTheTable(values['reward'])
  }

  const strikeThroughTheTable = (currentReward) => {
    document.querySelector(`[data-share-reward="${currentReward}"]`).classList.add('rowActive')
  }

  const addEventListeners = () => {
    copyInviteContractButton.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()
      const prevTextContent = copyInviteContractButton.textContent

      copyToClipboard(inviteContractAddress)
      copyInviteContractButton.innerHTML = prevTextContent + '<small class="smallCopy"> copied</small>'
      setTimeout(() => {
        copyInviteContractButton.textContent = prevTextContent
      }, 2000)
    })

    // getShareButton.addEventListener('click', (clickEvent) => {
    //   clickEvent.preventDefault()
    //   getShareTransaction()
    // })
  }

  fillInPageInfo()
  addEventListeners()
})