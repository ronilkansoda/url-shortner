export default function getDomain() {
    // Check if we're in a browser environment
    const isClient = typeof window !== 'undefined';

    if (process.env.NODE_ENV === 'production') {
        // For production environment
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else {
        // For development environment
        return 'http://localhost:3000';
    }
}