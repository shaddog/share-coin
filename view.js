import { copyToClipboard } from "./utils.js"
import { getShareTransaction } from "./wallet.js"

const contractAddressSlice = (contractAddress) => {
  if(typeof contractAddress !== 'string' || contractAddress.length !== 48) {
    throw new Error('contractAddress should be string type and 48 symbols length')
  }
  
  return contractAddress.slice(0, 6) + '...' + contractAddress.slice(42, 48)
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

const strikeThroughTheTable = (currentReward) => {
  document.querySelector(`[data-share-reward="${currentReward}"]`).classList.add('rowActive')
}

export const fillInPageInfo = (values) => {
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const value = values[key]

      try {
        const dataVars = document.querySelectorAll(`[data-var=${key}]`)
        dataVars.forEach(element => {
          element.textContent = formatNumber(value)
          element.classList.remove("loading")
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  strikeThroughTheTable(values['reward'])
}

export const showUserRef = () => {
  const userRefSection = document.querySelector('.userRefSection')
  const userRefSpan = document.querySelector('.userRefSpan')

  userRefSection.style.display = 'block'
  userRefSpan.textContent = `link ❐`
  userRefSpan.classList.remove("loading")

  userRefSpan.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault()
    const prevTextContent = userRefSpan.textContent.split('copied')[0]

    copyToClipboard(window.location.href)
    userRefSpan.innerHTML = prevTextContent + '<small class="smallCopy"> copied</small>'
    setTimeout(() => {
      userRefSpan.textContent = prevTextContent
    }, 2000)
  })
}

export const showInviterRef = async (inviterAddress, inviterRefAddress) => {
  const inviterRefSection = document.querySelector('.inviterRefSection')
  const inviterRefSpan = document.querySelector('.inviterRefSpan')
  const getShareButton = document.querySelector('#getShareButton')

  inviterRefSpan.textContent = contractAddressSlice(inviterAddress)
  inviterRefSection.style.display = 'block'

  getShareButton.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault()
    getShareTransaction(inviterRefAddress)
  })
}