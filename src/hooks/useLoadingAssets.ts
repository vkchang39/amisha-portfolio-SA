import { useSyncExternalStore } from "react";
import {
  DEFAULT_LOADING_SPLASH,
  DEFAULT_LOADING_TIP,
  getRandomSplash,
  getRandomTip,
} from "@/lib/loadingTips";

interface LoadingAssets {
  tip: string;
  splash: string;
}

const SERVER_ASSETS: LoadingAssets = {
  tip: DEFAULT_LOADING_TIP,
  splash: DEFAULT_LOADING_SPLASH,
};

let clientAssets: LoadingAssets | null = null;

function getClientAssets(): LoadingAssets {
  if (!clientAssets) {
    clientAssets = {
      tip: getRandomTip(),
      splash: getRandomSplash(),
    };
  }
  return clientAssets;
}

function subscribe() {
  return () => {};
}

export function useLoadingAssets(): LoadingAssets {
  return useSyncExternalStore(subscribe, getClientAssets, () => SERVER_ASSETS);
}
