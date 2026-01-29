"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("ld_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        // Simular API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: "1",
            name: "Usuario De Prueba",
            email: email,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        };

        setUser(mockUser);
        localStorage.setItem("ld_user", JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        // Simular API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: "2",
            name: name,
            email: email,
        };

        setUser(mockUser);
        localStorage.setItem("ld_user", JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ld_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
