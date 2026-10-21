const ACCOUNTS_STORAGE_KEY = 'lorebound.accounts';

export function readAccounts() {
  const storedAccounts = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!storedAccounts) {
    return [];
  }

  const accounts = JSON.parse(storedAccounts);
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear the Lorebound browser storage and try again.');
  }

  return accounts;
}

export function saveAccounts(accounts) {
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function saveCharacterForAccount(username, character) {
  const usernameKey = username.trim().toLowerCase();
  const accounts = readAccounts();
  const account = accounts.find((entry) => entry.usernameKey === usernameKey);

  if (!account) {
    throw new Error('Could not find the logged-in account to save this character.');
  }

  account.characterId = account.characterId || usernameKey;
  account.character = JSON.parse(JSON.stringify(character));
  saveAccounts(accounts);
}
