export type depthMessage = {
  type: "depth";
  data: {
    a?: [string, string][];
    b?: [string, string][];
    id: number;
    e: "depthUpdate";
  };
};

export type TikcerUpdateMessage = {
  type: "depth";
  data: {
    lastPrice?: string;
    e: "24hrTicker";
  };
};

export type OutMessage = TikcerUpdateMessage | depthMessage;
