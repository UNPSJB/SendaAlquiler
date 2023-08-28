/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_HOST: "http://localhost:8000/graphql"
    }
}

module.exports = nextConfig
