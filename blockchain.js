const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '95f7d69921d097025342890a6c4658b60902e857db60b8e8b60be3d8f1a2ad4f'}));
const mainContract = 'EQBCvIpYxafZgLH5YHi1sOwn4OoD7dRIzn_lnfKh456agxfY'
const mainContractRaw = '0:42bc8a58c5a7d980b1f96078b5b0ec27e0ea03edd448ce7fe59df2a1e39e9a83'

const getRefAddress = async (rawAddress) => {
  // if(localStorage.getItem("userRefAddressFriendly")) return localStorage.getItem("userRefAddressFriendly")

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
  
  
  // if(!localStorage.getItem("userRefAddressRaw")) localStorage.setItem("userRefAddressRaw", userRefAddressRaw)
  // localStorage.setItem("userRefAddressFriendly", userRefAddressFriendly)

  return userRefAddressFriendly
}

const areYouIn = async (refContract) => {
  const addressInfo = await tonweb.provider.getAddressInfo(refContract)

  if(addressInfo && addressInfo?.state === 'active') {
    return true
  }

  return false
}
  
const getSomeRealShit = async () => {
  // Share minted
  // common: get_balances.stack[0]
  
  // Current reward per 1 invite
  // common: get_current_reward
  
  // $TON on Treasury Contract
  // common: get_balances.stack[2]
  
  // Burned already
  // common: get_balances.stack[1]
  
  // Total emission
  // common: get_balances.stack[4]
  
  // Current rate
  // 1 $SHARE = get_burn_price TON
  
  // Table where are we now
  // get_current_reward
  const someRealShit = {
    'peopleInvited': '',
    'sharesMinted': '',
    'reward': '',
    'treasuryFund': '',
    'burned': '',
    'totalEmission': '',
    'oneShareInTonRate': '',
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
  
  someRealShit['peopleInvited'] = parseInt(getInvites.stack[0][1], 16).toString() 
  someRealShit['sharesMinted'] = tonweb.utils.fromNano(parseInt(getBalances.stack[0][1], 16).toString())
  someRealShit['burned'] = tonweb.utils.fromNano(parseInt(getBalances.stack[1][1], 16).toString())
  someRealShit['treasuryFund'] = tonweb.utils.fromNano(parseInt(getBalances.stack[2][1], 16).toString())
  someRealShit['totalEmission'] = tonweb.utils.fromNano(parseInt(getBalances.stack[3][1], 16).toString())
  someRealShit['reward'] = tonweb.utils.fromNano((parseInt(getCurrentReward.stack[0][1], 16)/2).toString())
  someRealShit['oneShareInTonRate'] = tonweb.utils.fromNano(parseInt(getCurrentRate.stack[0][1], 16).toString())
  someRealShit['amountOfShareForOneTon'] = 1 / Number(someRealShit['oneShareInTonRate'])

  return someRealShit
}