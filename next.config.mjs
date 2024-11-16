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
            },
        };

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process: "process/browser",
            })
        );

        return config;
    },
};

export default nextConfig;
