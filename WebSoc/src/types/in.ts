export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";

export type SubscribeMessage = {
  type: typeof SUBSCRIBE;
  params: [];
};

export type UnsubscribeMessage = {
  type: typeof UNSUBSCRIBE;
  params: [];
};

export type InMessage = SubscribeMessage | UnsubscribeMessage;
