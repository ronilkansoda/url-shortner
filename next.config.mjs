import webpack from 'webpack';
import process from 'process/browser';  // Import process from 'process/browser'

const nextConfig = {
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer"),
                process: require.resolve("process/browser"), // Make sure this points to process/browser
            },
        };

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process: "process/browser",  // Ensure process is provided
            })
        );

        return config;
    },
};

export default nextConfig;
