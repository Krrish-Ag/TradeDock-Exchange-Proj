//saw these letters froom useEffect of client, like what they are exepcting

export type TikcerUpdateType = {
  stream: string;
  data: {
    lastPrice: string;
    e: "24hrTicker";
  };
};

export type DepthUpdateType = {
  stream: string;
  data: {
    b: [string, string][];
    a: [string, string][];
    e: "depthUpdate";
  };
};

export type TradeAddedType = {
  stream: string;
  data: {
    tradeId?: number;
    isBuyerMaker?: boolean;
    price?: string;
    qty?: string;
    time: number;
    e: "trade";
  };
};

export type WsMessage = TikcerUpdateType | DepthUpdateType | TradeAddedType;
