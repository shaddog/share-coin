document.addEventListener("DOMContentLoaded", function() {
  const shareCost = 742;
  const currentReward = 36;
  const amountOfBurnedShares = 2365;
  
  
  const fillInPageInfo = function () {
    const shareCostNode = document.querySelector('#shareCost')
    const currentRewardNode = document.querySelector('#currentReward')
    const amountOfBurnedSharesNode = document.querySelector('#amountOfBurnedShares')
    // const lastTreasuryContractsNode = document.querySelector('#lastTreasuryContracts')

    shareCostNode.textContent = formatNumber(shareCost)
    currentRewardNode.textContent = formatNumber(currentReward)
    amountOfBurnedSharesNode.textContent = formatNumber(amountOfBurnedShares)
    // lastTreasuryContractsNode.innerHTML = lastTreasuryContracts()
  }

  const contractAddressSlice = function (contractAddress) {
    if(typeof contractAddress !== 'string' || contractAddress.length !== 48) {
      throw new Error('contractAddress should be string type and 48 symbols length')
    }
    
    return contractAddress.slice(0, 6) + '...' + contractAddress.slice(42, 48)
  }

  const formatNumber = function(number) {
    return new Intl.NumberFormat('en-US').format(number)
  }

  const lastTreasuryContracts = function () {
    const lastTreasuryContracts = [
      ''
    ]
  }

  fillInPageInfo()
})