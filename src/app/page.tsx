import { AccountComponent } from './accountComponent';
import { TransactionComponent } from './transactionComponent';

let activeNetworkType = 0;
let activeAccountPublicKey = '';

export default function Home() {
  const sssExtHandler = async (networkType: number, accountPublicKey: string): Promise<void> => {
    'use server';
    activeNetworkType = networkType;
    activeAccountPublicKey = accountPublicKey;
  };

  return (
    <main className="min-h-screen items-center justify-between p-24">
      <div>
        <AccountComponent sssExtHandler={sssExtHandler} />
        <TransactionComponent
          displayNetworkType={activeNetworkType}
          displayAccountPublicKey={activeAccountPublicKey}
        />
      </div>
    </main>
  );
}
