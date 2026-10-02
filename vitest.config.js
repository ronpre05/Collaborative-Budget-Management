import { defineConfig } from "vite";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        // Placeholder values so the Supabase client can be constructed without a local .env
        env: {
            VITE_SUPABASE_URL: "http://localhost:54321",
            VITE_SUPABASE_ANON_KEY: "test-anon-key",
        },
    },
});
