import webpack from 'webpack';
import process from 'process/browser.js'; // Ensure process is correctly imported

const nextConfig = {
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer'),
                process: require.resolve('process/browser.js'),
            },
        };

        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser.js', // Ensure process is provided correctly
            })
        );

        return config;
    },
};

export default nextConfig;
