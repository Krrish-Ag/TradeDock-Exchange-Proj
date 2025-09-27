export type depthMessage = {
  type: "ticker";
  data: {
    a?: [string, string][];
    b?: [string, string][];
    id: number;
    e: "24hrTicker";
  };
};

export type TikcerUpdateMessage = {
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
    id: number;
    e: "24hrTicker";
  };
};

export type OutMessage = TikcerUpdateMessage | depthMessage;
