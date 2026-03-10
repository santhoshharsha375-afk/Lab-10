import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
  Outlet,
  useNavigate,
} from "react-router-dom";

const envName = import.meta.env.VITE_ENV_NAME;

function Layout({ isLoggedIn, onLogout }) {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h1>Lab 10 – React SPA Deployment</h1>
        <p>Environment: {envName}</p>
        <nav style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/reviews">Reviews</Link>
          {isLoggedIn ? (
            <button onClick={onLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

const products = [
  { id: "1", name: "Laptop", description: "High‑performance laptop" },
  { id: "2", name: "Phone", description: "Smartphone with great camera" },
];

function Home() {
  return (
    <section>
      <h2>Home</h2>
      <p>
        This Single Page Application demonstrates routing, protected routes and
        a validated feedback form, then is bundled and deployed for Lab 10.
      </p>
    </section>
  );
}

function Products() {
  return (
    <section>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </section>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <section>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Link to="reviews">View reviews</Link>
      <Outlet />
    </section>
  );
}

function ProductReviews() {
  const { id } = useParams();
  return (
    <section>
      <h4>Reviews for product {id}</h4>
      <ul>
        <li>Great product!</li>
        <li>Very useful in daily work.</li>
      </ul>
    </section>
  );
}

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim().length === 0) {
      alert("Enter email to simulate login");
      return;
    }
    onLogin();
    navigate("/");
  }

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email is required";
    if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <section>
      <h2>Feedback form</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>
        <div>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        <div>
          <label>
            Message:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
            />
          </label>
          {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}
        </div>
        <button type="submit">Send</button>
      </form>
      {submitted && (
        <p style={{ color: "green" }}>
          Thank you for your feedback! (form validated and submitted)
        </p>
      )}
    </section>
  );
}

function ReviewsPage() {
  return (
    <section>
      <h2>Protected Reviews Area</h2>
      <p>Only visible when login simulation is true.</p>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <h2>404 - Not Found</h2>
      <Link to="/">Go Home</Link>
    </section>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            isLoggedIn={isLoggedIn}
            onLogout={() => setIsLoggedIn(false)}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="products" element={<Products />}>
          <Route path=":id" element={<ProductDetails />}>
            <Route path="reviews" element={<ProductReviews />} />
          </Route>
        </Route>

        <Route
          path="reviews"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
