export default function Home() {
    return (
        <main style={{ padding: '2rem'}}>
            <p>This site showcases my projects built and deployed</p>
            <button onClick={() => alert=('Hello!')}>Click Me</button>
            <footer style={{ marginTop: '2rem', fontSize: '0.8rem'}}>
                © {new Date().getFullYear()} Tanishk Deoghare
            </footer>
        </main>
    );
}