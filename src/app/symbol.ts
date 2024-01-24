'use server';
import symbolSdk from 'symbol-sdk';

export const getNetworkTypeName = (networkType: number): string => {
  return symbolSdk.symbol.NetworkType.valueToKey(networkType);
};

export const createTransaction = async (
  networkType: number,
  signerPublicKey: string,
  recipientAddress: string,
  amount: bigint,
  message: string
): Promise<string> => {
  // facade生成
  const networkTypeName = getNetworkTypeName(networkType);
  const facade = new symbolSdk.facade.SymbolFacade(networkTypeName.toLowerCase());

  // メッセージ作成
  const messageData = new Uint8Array([0x00, ...new TextEncoder().encode(message)]);

  // 転送トランザクション生成
  const transferTx = facade.transactionFactory.create({
    type: 'transfer_transaction_v1',
    signerPublicKey: signerPublicKey,
    deadline: facade.network.fromDatetime(new Date()).addHours(2).timestamp,
    recipientAddress: recipientAddress,
    mosaics: [{ mosaicId: 0x72c0212e67a08bcen, amount: BigInt(amount) }],
    message: messageData,
  });
  // 手数料計算
  transferTx.fee = new symbolSdk.symbol.Amount(BigInt(transferTx.size * 100));

  // トランザクションシリアライズ化
  const serializedTx = Buffer.from(transferTx.serialize()).toString('hex');

  return serializedTx;
};
