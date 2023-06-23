const contractAddressSlice = (contractAddress) => {
  if(typeof contractAddress !== 'string' || contractAddress.length !== 48) {
    throw new Error('contractAddress should be string type and 48 symbols length')
  }
  
  return contractAddress.slice(0, 6) + '...' + contractAddress.slice(42, 48)
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

const showUserRefContract = (addr) => {
  const activeUserSection = document.querySelector('.activeUserSection')
  const userRefSpan = document.querySelector('.userRefSpan')

  activeUserSection.style.display = 'block'
  userRefSpan.textContent = contractAddressSlice(addr) + ' ❐'

  userRefSpan.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault()
    const prevTextContent = userRefSpan.textContent

    copyToClipboard(addr)
    userRefSpan.innerHTML = prevTextContent + '<small class="smallCopy"> copied</small>'
    setTimeout(() => {
      userRefSpan.textContent = prevTextContent
    }, 2000)
  })
}

const strikeThroughTheTable = (currentReward) => {
  document.querySelector(`[data-share-reward="${currentReward}"]`).classList.add('rowActive')
}

document.addEventListener("DOMContentLoaded", async () => {
  // NODES
  const newUserSection = document.querySelector('.newUserSection')
  const getShareButton = document.querySelector('#getShareButton')
  const newUserInviterSpan = document.querySelector('.newUserInviter')
  
  const checkInviter = (async () => {
    if(window.location.hash) {
      const inviterAddress = window.location.hash.split('#')[1]
      const refContract = await getRefAddress(inviterAddress)
      const isRefContractActive = await areYouIn(refContract)

      if(refContract && isRefContractActive) {
        newUserInviterSpan.textContent = contractAddressSlice(refContract)
        newUserSection.style.display = 'block'

        getShareButton.addEventListener('click', (clickEvent) => {
          clickEvent.preventDefault()
          getShareTransaction(refContract)
        })
      }
    }
  })()

  // VALUES
  const values = await getSomeRealShit()
  
  const fillInPageInfo = (() => {
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

    strikeThroughTheTable(values['reward'])
  })()
})