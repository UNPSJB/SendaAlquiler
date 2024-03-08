// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
});

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const envConfigData = {
    NEXTAUTH_URL: {
        development: 'http://localhost:3000',
        production: 'http://localhost:3000',
        staging: 'http://localhost:3000',
    },
    NEXTAUTH_SECRET: {
        development: 'mysecret',
        production: 'mysecret',
        staging: 'mysecret',
    },
    NEXT_PUBLIC_API_HOST: {
        development: 'http://localhost:8000',
        production: 'http://localhost:8000',
        staging: 'http://localhost:8000',
    },
    NEXT_PUBLIC_HOST: {
        development: 'http://localhost:3000',
        production: 'http://localhost:3000',
        staging: 'http://localhost:3000',
    },
};

let envKey = 'production';
if (process.env.NEXT_ENV === 'staging') {
    envKey = 'staging';
} else if (process.env.NEXT_ENV !== 'production') {
    envKey = 'development';
}

const env = Object.keys(envConfigData).reduce((obj, key) => {
    obj[key] = envConfigData[key][envKey];
    return obj;
}, {});

/** @type {import('next').NextConfig} */
const nextConfig = {
    env,
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withBundleAnalyzer(nextConfig);
