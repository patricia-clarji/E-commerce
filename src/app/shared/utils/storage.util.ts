// src/app/shared/utils/storage.util.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Safe storage helper that works with SSR/hydration.
 * Never touches localStorage on the server.
 */
export class StorageUtil {
    private static isBrowser(): boolean {
        // When called outside DI context, fallback to typeof window check
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    static get<T>(key: string): T | null {
        if (!this.isBrowser()) return null;

        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }

    static set<T>(key: string, value: T): void {
        if (!this.isBrowser()) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // ignore
        }
    }

    static getString(key: string): string | null {
        if (!this.isBrowser()) return null;
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    static setString(key: string, value: string | null): void {
        if (!this.isBrowser()) return;

        try {
            if (value == null) localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        } catch {
            // ignore
        }
    }

    static remove(key: string): void {
        if (!this.isBrowser()) return;
        try {
            localStorage.removeItem(key);
        } catch {
            // ignore
        }
    }
}