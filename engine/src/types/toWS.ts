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
  };
};

export type DepthUpdateType = {
  stream: string;
  data: {
    b: [string, string][];
    a: [string, string][];
  };
};

export type TradeAddedType = {
  stream: string;
  data: {
    t?: number;
    m?: boolean;
    p?: string;
    q?: string;
  };
};

export type WsMessage = TikcerUpdateType | DepthUpdateType | TradeAddedType;
