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
  
  // NODES
  const getShareSection = document.querySelector('.getShareSection')
  const getShareButton = document.querySelector('#getShareButton')
  const copyInviteContractButton = document.querySelector('#copyContractButton')
  
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

    strikeThroughTheTable(values['reward'])
  }

  const strikeThroughTheTable = (currentReward) => {
    document.querySelector(`[data-share-reward="${currentReward}"]`).classList.add('rowActive')
  }

  const addEventListeners = (refAddr) => {
    copyInviteContractButton.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()
      const prevTextContent = copyInviteContractButton.textContent

      copyToClipboard(refAddr)
      copyInviteContractButton.innerHTML = prevTextContent + '<small class="smallCopy"> copied</small>'
      setTimeout(() => {
        copyInviteContractButton.textContent = prevTextContent
      }, 2000)
    })

    getShareButton.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()
      getShareTransaction()
    })
  }

  const checkRef = async () => {
    if(window.location.hash) {
      console.log(window.location.hash.split('#')[1])
      const refAddr = await getRefAddress(window.location.hash.split('#')[1])
   
      if (refAddr) {
        copyInviteContractButton.textContent = contractAddressSlice(refAddr) + ' ❐'
        addEventListeners(refAddr)
        getShareSection.style.display = 'block'
      }
    }
  }

  await checkRef()
  fillInPageInfo()
})