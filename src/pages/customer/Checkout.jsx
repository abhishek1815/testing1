export default function Checkout() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--on-surface)", marginBottom: "0.5rem" }}>
        Checkout
      </h1>
      <p style={{ color: "var(--on-surface-variant)", marginBottom: "2rem" }}>
        Review your order and complete payment.
      </p>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "4rem 2rem", backgroundColor: "var(--surface-container-low)",
        borderRadius: "1rem", border: "1px solid var(--border-subtle)", textAlign: "center",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "var(--on-surface-variant)", opacity: 0.4, marginBottom: "1rem" }}>
          payments
        </span>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--on-surface)", marginBottom: "0.5rem" }}>
          Checkout coming soon
        </h2>
        <p style={{ color: "var(--on-surface-variant)", fontSize: "0.9rem" }}>
          Payment integration is being built.
        </p>
      </div>
    </div>
  );
}
