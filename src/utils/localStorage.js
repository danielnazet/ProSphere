const STORAGE_KEYS = {
	PRODUCTS: "prosphere_products",
	CLIENTS: "prosphere_clients",
	INVOICES: "prosphere_invoices",
	TRANSACTIONS: "prosphere_transactions",
};

export const loadFromStorage = (key) => {
	try {
		const data = localStorage.getItem(STORAGE_KEYS[key]);
		return data ? JSON.parse(data) : [];
	} catch (error) {
		console.error(`Error loading ${key} from localStorage:`, error);
		return [];
	}
};

export const saveToStorage = (key, data) => {
	try {
		localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
	} catch (error) {
		console.error(`Error saving ${key} to localStorage:`, error);
	}
};
