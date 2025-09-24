//saw these letters froom useEffect of client, like what they are exepcting

export type TikcerUpdateType = {
  stream: string;
  data: {
    h?: string;
    l?: string;
    v?: string;
    s?: string;
    c?: string;
    q?: string;
    p?: string;
    P?: string;
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
    t?: number;
    m?: boolean;
    p?: string;
    q?: string;
    e: "trade";
  };
};

export type WsMessage = TikcerUpdateType | DepthUpdateType | TradeAddedType;
