
export const setToken = (token: string): void => {
    localStorage.setItem('Token', token);
};

export const fetchToken = (): string | null => {
    return localStorage.getItem('Token');
};

export const removeToken = (): void => {
    localStorage.removeItem('Token');
};