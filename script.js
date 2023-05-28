const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://share.fra1.cdn.digitaloceanspaces.com/manifest.json',
  buttonRootId: 'connectWallet'
});

const tonweb = new TonWeb();
const mainContract = 'EQBNK2J2-muuuvxXXFZ9kmi98DJTF_LZt_SdrrlD6DEMjab4'
const mainContractRaw = '0:4d2b6276fa6baebafc575c567d9268bdf0325317f2d9b7f49daeb943e8310c8d'

const retrieveHistory = async (address) => {
  const history = await tonweb.getTransactions(address);
  console.log(history)
}

const getRefAddress = async (rawAddress) => {
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
  const userRefAddressRaw = userRefAddress.toString()
  const userRefAddressFriendly = userRefAddress.toString(true, true, true, false) //check params https://github.com/toncenter/tonweb/blob/master/src/utils/Address.js#L109
  
  console.log(userRefAddressRaw)
  console.log(userRefAddressFriendly)
}

const unsubscribe = tonConnectUI.onStatusChange(
  async (walletInfo) => {
    await getRefAddress(walletInfo.account.address)
  } 
);