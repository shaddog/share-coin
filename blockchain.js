const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '95f7d69921d097025342890a6c4658b60902e857db60b8e8b60be3d8f1a2ad4f'}));
const mainContract = 'EQDsh-h3cHtc3FjeTz8oMLsRjlekFih6b6zphKGK0RRYDeG-'
const mainContractRaw = '0:ec87e877707b5cdc58de4f3f2830bb118e57a416287a6face984a18ad114580d'

export const getRefAddress = async (rawAddress) => {
  const cell = new tonweb.boc.Cell()
  cell.bits.writeAddress(new tonweb.Address(rawAddress))
  
  const bocBytes = await cell.toBoc(false)
  const bocInString = tonweb.utils.bytesToBase64(bocBytes)
  
  const response = await tonweb.call(
    mainContractRaw,
    'get_ref_address',
    [['tvm.Slice', bocInString]]
  )
    
  const responseBytes = tonweb.utils.base64ToBytes(response.stack[0][1].bytes)
  const responseCell = tonweb.boc.Cell.oneFromBoc(responseBytes)
  const responseSlice = responseCell.beginParse()
  const userRefAddress = responseSlice.loadAddress()
  // const userRefAddressRaw = userRefAddress.toString()
  const userRefAddressFriendly = userRefAddress.toString(true, true, true, false) //check params https://github.com/toncenter/tonweb/blob/master/src/utils/Address.js#L109

  return userRefAddressFriendly
}

export const rawAddressToFriendly = (rawAddress) => {
  return new tonweb.Address(rawAddress).toString(true, true, true)
}

export const areYouIn = async (refContract) => {
  const addressInfo = await tonweb.provider.getAddressInfo(refContract)

  if(addressInfo && addressInfo?.state === 'active') {
    return true
  }

  return false
}
  
export const getSomeRealSh = async () => {
  const someRealSh = {
    'peopleInvited': '',
    'sharesMinted': '',
    'reward': '',
    'treasuryFund': '',
    'burned': '',
    'totalEmission': '',
    'amountOfShareForOneTon': '',
  }
  
  const getInvites = await tonweb.call(
    mainContractRaw,
    'get_invites',
  )
  const getBalances = await tonweb.call(
    mainContractRaw,
    'get_balances'
  )
  const getCurrentReward = await tonweb.call(
    mainContractRaw,
    'get_current_reward'
  )
  const getCurrentRate = await tonweb.call(
    mainContractRaw,
    'get_burn_price'
  )
  
  someRealSh['peopleInvited'] = parseInt(getInvites.stack[0][1], 16).toString() 
  someRealSh['sharesMinted'] = tonweb.utils.fromNano(parseInt(getBalances.stack[0][1], 16).toString())
  someRealSh['burned'] = tonweb.utils.fromNano(parseInt(getBalances.stack[1][1], 16).toString())
  someRealSh['treasuryFund'] = tonweb.utils.fromNano(parseInt(getBalances.stack[2][1], 16).toString())
  someRealSh['totalEmission'] = tonweb.utils.fromNano(parseInt(getBalances.stack[3][1], 16).toString())
  someRealSh['reward'] = tonweb.utils.fromNano((parseInt(getCurrentReward.stack[0][1], 16)/2).toString())
  someRealSh['amountOfShareForOneTon'] = parseInt(getCurrentRate.stack[0][1], 16).toString()

  return someRealSh
}