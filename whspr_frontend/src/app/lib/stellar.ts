// @ts-nocheck
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
  signAuthEntry,
  signMessage,
  addToken,
  WatchWalletChanges,
} from "@stellar/freighter-api";

/**
 * Check if Freighter is installed and connected
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch (err) {
    console.error("Freighter connection check failed:", err);
    return false;
  }
}

/**
 * Ask user to authorize app for Freighter
 */
export async function authorizeApp(): Promise<boolean> {
  try {
    const result = await setAllowed();
    return result.isAllowed;
  } catch (err) {
    console.error("Authorization failed:", err);
    return false;
  }
}

/**
 * Request access to user’s wallet (prompts if first time)
 */
export async function connectWallet(): Promise<string | null> {
  try {
    const access = await requestAccess();
    if (access.error) {
      console.error("Access denied:", access.error);
      return null;
    }
    return access.address;
  } catch (err) {
    console.error("Request access failed:", err);
    return null;
  }
}

/**
 * Get the user’s public address (if already authorized)
 */
export async function getUserAddress(): Promise<string | null> {
  try {
    const result = await getAddress();
    if (result.error) {
      console.error("Failed to get address:", result.error);
      return null;
    }
    return result.address;
  } catch (err) {
    console.error("Get address failed:", err);
    return null;
  }
}

/**
 * Get current network (basic info)
 */
export async function getCurrentNetwork(): Promise<{
  network: string;
  networkPassphrase: string;
} | null> {
  try {
    const result = await getNetwork();
    if (result.error) {
      console.error("Failed to get network:", result.error);
      return null;
    }
    return {
      network: result.network,
      networkPassphrase: result.networkPassphrase,
    };
  } catch (err) {
    console.error("Get network failed:", err);
    return null;
  }
}

/**
 * Get full network details (includes RPC URLs)
 */
export async function getNetworkConfig() {
  try {
    const details = await getNetworkDetails();
    if (details.error) {
      console.error("Failed to get network details:", details.error);
      return null;
    }
    return details;
  } catch (err) {
    console.error("Get network details failed:", err);
    return null;
  }
}

/**
 * Sign a transaction XDR
 */
export async function signTx(
  xdr: string,
  opts?: { networkPassphrase?: string; address?: string }
) {
  try {
    const signed = await signTransaction(xdr, opts);
    if (signed.error) {
      console.error("Transaction signing failed:", signed.error);
      return null;
    }
    return signed.signedTxXdr;
  } catch (err) {
    console.error("Sign transaction error:", err);
    return null;
  }
}

/**
 * Sign an authorization entry
 */
export async function signAuthorization(authEntryXdr: string, address: string) {
  try {
    const signed = await signAuthEntry(authEntryXdr, { address });
    if (signed.error) {
      console.error("Auth signing failed:", signed.error);
      return null;
    }
    return signed.signedAuthEntry;
  } catch (err) {
    console.error("Sign auth entry error:", err);
    return null;
  }
}

/**
 * Sign a plain text message
 */
export async function signUserMessage(message: string, address: string) {
  try {
    const signed = await signMessage(message, { address });
    if (signed.error) {
      console.error("Message signing failed:", signed.error);
      return null;
    }
    return signed.signedMessage;
  } catch (err) {
    console.error("Sign message error:", err);
    return null;
  }
}

/**
 * Add Soroban token to Freighter
 */
export async function addSorobanToken(
  contractId: string,
  networkPassphrase?: string
) {
  try {
    const result = await addToken({ contractId, networkPassphrase });
    if (result.error) {
      console.error("Failed to add token:", result.error);
      return null;
    }
    return result.contractId;
  } catch (err) {
    console.error("Add token error:", err);
    return null;
  }
}

/**
 * Watch for wallet changes (address, network, etc.)
 */
export function watchWalletChanges(
  callback: (update: {
    address: string;
    network: string;
    networkPassphrase: string;
  }) => void,
  interval = 3000
) {
  const watcher = new WatchWalletChanges(interval);
  watcher.watch(callback);
  return watcher;
}
