import webpack from "webpack";

const nextConfig = {
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                crypto: "crypto-browserify",
                stream: "stream-browserify",
                buffer: "buffer",
                process: "process/browser",  // Add this to resolve 'process/browser' issue
            },
        };

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process: "process/browser",  // Provide process as a global
            })
        );

        return config;
    },
};

export default nextConfig;
