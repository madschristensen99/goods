import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
import { BUY_MY_COFFEE_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const data = encodeFunctionData({
    abi: BuyMeACoffeeABI,
    functionName: 'handleFundraiser',
    args: [],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: BUY_MY_COFFEE_CONTRACT_ADDR,
      value: parseEther('0.01').toString(), // 0.01 ETH
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const response = await getResponse(req);
    if (response.ok) {
      const responseData = await response.json();
      return new Response(JSON.stringify(responseData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response('Failed to send transaction', { status: response.status });
    }
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
