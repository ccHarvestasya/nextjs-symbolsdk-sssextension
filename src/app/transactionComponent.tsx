'use client';
import axios from 'axios';
import { useState } from 'react';
import {
  getActiveNetworkType,
  getActivePublicKey,
  requestSign,
  setTransactionByPayload,
} from 'sss-module';
import { createTransaction } from './symbol';

type Props = {
  displayNetworkType: number;
  displayAccountPublicKey: string;
};

export const TransactionComponent = ({ displayNetworkType, displayAccountPublicKey }: Props) => {
  const [errorMsg, setErrorMsg] = useState('');

  const sendTransaction = async (data: FormData) => {
    // 入力チェック
    if (
      displayNetworkType !== getActiveNetworkType() ||
      displayAccountPublicKey !== getActivePublicKey()
    ) {
      setErrorMsg('SSSエクステンションの設定が変更されています。リロードしてください。');
      return;
    }
    if (data.get('address') === '') {
      setErrorMsg('送信先アドレスを入力してください。');
      return;
    }

    let amount = '0';
    if (data.get('amount') !== '') {
      amount = Number(data.get('amount')!.toString()).toFixed(6);
      amount = amount.replace('.', '');
    }

    // トランザクション生成
    const unsignedTx = await createTransaction(
      getActiveNetworkType(),
      getActivePublicKey(),
      data.get('address')!.toString(),
      BigInt(amount),
      data.get('message')!.toString()
    );

    // SSS Extension で署名
    setTransactionByPayload(unsignedTx);
    const signedTx = await requestSign();
    const jsonPayload = `{"payload":"${signedTx.payload}"}`;

    // アナウンス
    const node = axios.create({
      baseURL: process.env.NEXT_PUBLIC_NODE_URL,
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await node.put('/transactions', jsonPayload).then((res) => res.data);
    console.log(response);
  };

  return (
    <>
      <div className="py-5">
        <form action={sendTransaction}>
          <input
            type="text"
            name="address"
            placeholder="address"
            className="text-black my-2 w-96"
          />
          <br />
          <input
            type="text"
            name="amount"
            placeholder="amount"
            className="text-black my-2 text-right"
          />{' '}
          XYM
          <br />
          <textarea
            name="message"
            placeholder="message"
            className="text-black my-2 w-96 h-28"
          ></textarea>
          <br />
          <button className="border-2">トランザクション送信</button>
          <p>{errorMsg}</p>
        </form>
      </div>
    </>
  );
};
