'use client';
import { useEffect, useState } from 'react';
import {
  getActiveAddress,
  getActiveName,
  getActiveNetworkType,
  getActivePublicKey,
  requestSSS,
} from 'sss-module';
import { getNetworkTypeName } from './symbol';

type Props = {
  sssExtHandler: (networkType: number, accountPublicKey: string) => void;
};

export const AccountComponent = ({ sssExtHandler }: Props) => {
  const [networkTypeName, setNetworkTypeName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [accountPublicKey, setAccountPublicKey] = useState('');

  useEffect(() => {
    if (requestSSS()) {
      // SSSエクステンションが有効の時
      setNetworkTypeName(getNetworkTypeName(getActiveNetworkType()));
      setAccountName(getActiveName());
      setAccountAddress(getActiveAddress());
      setAccountPublicKey(getActivePublicKey());

      // 親にネットワークタイプと公開鍵を渡す
      sssExtHandler(getActiveNetworkType(), getActivePublicKey());
    }
  }, [sssExtHandler]);

  return (
    <>
      <div className="py-5">
        <p>NetworkType: {networkTypeName}</p>
        <p>Account Name: {accountName}</p>
        <p>Address: {accountAddress}</p>
        <p>PublicKey: {accountPublicKey}</p>
      </div>
    </>
  );
};
