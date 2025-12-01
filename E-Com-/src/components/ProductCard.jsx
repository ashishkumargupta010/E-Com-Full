const ProductCard = ({ product, onAddToCart }) => {
  const placeOrder = (product) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
      alert("Please login first!");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
      user: loggedUser.emailOrPhone,
      productName: product.name,
      price: product.price,
      status: "Pending",
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    alert("Order placed successfully!");
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      {/* Add to Cart Button */}
      <button style={styles.button} onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>

      {/* Buy Now Button */}
      <button style={styles.buyButton} onClick={() => placeOrder(product)}>
        Buy Now
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    width: "200px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  buyButton: {
    marginTop: "10px",
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
};

export default ProductCard;
