import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./Dashboard.css";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [lowStockLimit, setLowStockLimit] =
    useState(10);

  const [currency, setCurrency] =
    useState("KSh");

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setSales([]);
      setLoading(false);
      return;
    }

    loadDashboardData();

    // Refresh whenever dashboard becomes visible again
    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [user]);

  // =========================
  // LOAD EVERYTHING
  // =========================

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // =========================
      // PRODUCTS
      // =========================

      const {
        data: productData,
        error: productError
      } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false
        });

      if (productError) {
        console.error(
          "Dashboard products error:",
          productError
        );
      } else {
        const formattedProducts =
          (productData || []).map(
            (product) => {
              const shelfQuantity =
                Number(
                  product.shelf_quantity
                ) || 0;

              const storeQuantity =
                Number(
                  product.store_quantity
                ) || 0;

              return {
                ...product,

                shelfQuantity,

                storeQuantity,

                buyingPrice:
                  Number(
                    product.buying_price
                  ) || 0,

                sellingPrice:
                  Number(
                    product.selling_price
                  ) || 0,

                quantity:
                  shelfQuantity +
                  storeQuantity
              };
            }
          );

        setProducts(
          formattedProducts
        );
      }

      // =========================
      // SALES
      // =========================

      const {
        data: salesData,
        error: salesError
      } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: true
        });

      if (salesError) {
        console.error(
          "Dashboard sales error:",
          salesError
        );
      } else {
        setSales(
          salesData || []
        );
      }

      // =========================
      // SETTINGS
      // =========================

      const {
        data: settingsData,
        error: settingsError
      } = await supabase
        .from("settings")
        .select(
          "low_stock_limit, currency"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (settingsError) {
        console.error(
          "Dashboard settings error:",
          settingsError
        );
      }

      if (settingsData) {
        setLowStockLimit(
          Number(
            settingsData.low_stock_limit
          ) || 10
        );

        setCurrency(
          settingsData.currency ||
            "KSh"
        );
      } else {
        setLowStockLimit(10);
        setCurrency("KSh");
      }
    } catch (error) {
      console.error(
        "Dashboard loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET TOTAL STOCK
  // =========================

  const getTotalStock = (product) => {
    const shelfQuantity =
      Number(
        product.shelfQuantity
      ) || 0;

    const storeQuantity =
      Number(
        product.storeQuantity
      ) || 0;

    return (
      shelfQuantity +
      storeQuantity
    );
  };

  // =========================
  // STATISTICS
  // =========================

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (sum, product) =>
        sum +
        getTotalStock(product),
      0
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        getTotalStock(product) <=
        lowStockLimit
    );

  const inventoryValue =
    products.reduce(
      (sum, product) => {
        const quantity =
          getTotalStock(product);

        return (
          sum +
          Number(
            product.buyingPrice
          ) *
            quantity
        );
      },
      0
    );

  const potentialProfit =
    products.reduce(
      (sum, product) => {
        const quantity =
          getTotalStock(product);

        return (
          sum +
          (
            Number(
              product.sellingPrice
            ) -
            Number(
              product.buyingPrice
            )
          ) *
            quantity
        );
      },
      0
    );

  // =========================
  // SALES STATISTICS
  // =========================

  const totalItemsSold =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.quantity || 0
        ),
      0
    );

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.revenue || 0
        ),
      0
    );

  const totalProfit =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.profit || 0
        ),
      0
    );

  // =========================
  // CATEGORIES
  // =========================

  const categories = {};

  products.forEach(
    (product) => {
      const category =
        product.category ||
        "Other";

      if (
        categories[category]
      ) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    }
  );

  // =========================
  // RECENT PRODUCTS
  // =========================

  const recentProducts =
    products.slice(0, 5);

  // =========================
  // SALES CHART
  // =========================

  const chartData = {};

  sales.forEach(
    (sale) => {
      const date =
        sale.date ||
        (
          sale.created_at
            ? new Date(
                sale.created_at
              ).toLocaleDateString()
            : "Unknown"
        );

      if (!chartData[date]) {
        chartData[date] = {
          date,
          revenue: 0,
          profit: 0
        };
      }

      chartData[date].revenue +=
        Number(
          sale.revenue || 0
        );

      chartData[date].profit +=
        Number(
          sale.profit || 0
        );
    }
  );

  const salesChartData =
    Object.values(
      chartData
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard">

        <div className="dashboard-header">

          <h1>
            📊 Dashboard
          </h1>

          <p>
            Loading your shop data...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <h1>
          📊 Dashboard
        </h1>

        <p>
          Overview of your electrical
          shop inventory.
        </p>

      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="stats-container">

        {/* TOTAL PRODUCTS */}

        <div className="stat-card">

          <h3>
            📦 Total Products
          </h3>

          <h2>
            {totalProducts}
          </h2>

        </div>

        {/* TOTAL STOCK */}

        <div className="stat-card">

          <h3>
            📊 Total Stock
          </h3>

          <h2>
            {totalStock}
          </h2>

        </div>

        {/* LOW STOCK */}

        <div className="stat-card">

          <h3>
            ⚠️ Low Stock
          </h3>

          <h2>
            {lowStockProducts.length}
          </h2>

        </div>

        {/* INVENTORY VALUE */}

        <div className="stat-card">

          <h3>
            💰 Inventory Value
          </h3>

          <h2>
            {currency}{" "}
            {inventoryValue.toLocaleString()}
          </h2>

        </div>

        {/* POTENTIAL PROFIT */}

        <div className="stat-card">

          <h3>
            📈 Potential Profit
          </h3>

          <h2>
            {currency}{" "}
            {potentialProfit.toLocaleString()}
          </h2>

        </div>

        {/* ITEMS SOLD */}

        <div className="stat-card">

          <h3>
            🛒 Items Sold
          </h3>

          <h2>
            {totalItemsSold}
          </h2>

        </div>

        {/* SALES REVENUE */}

        <div className="stat-card">

          <h3>
            💵 Sales Revenue
          </h3>

          <h2>
            {currency}{" "}
            {totalRevenue.toLocaleString()}
          </h2>

        </div>

        {/* PROFIT MADE */}

        <div className="stat-card">

          <h3>
            📈 Profit Made
          </h3>

          <h2>
            {currency}{" "}
            {totalProfit.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* =========================
          SALES CHART
      ========================= */}

      <div className="dashboard-card chart-card">

        <div className="card-header">

          <h2>
            📈 Sales Overview
          </h2>

          <p>
            Revenue and profit from your sales.
          </p>

        </div>

        {salesChartData.length === 0 ? (

          <div className="empty-chart">

            <span>
              📊
            </span>

            <p>
              No sales data yet
            </p>

            <small>
              Complete a sale to see your
              sales chart.
            </small>

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart
              data={salesChartData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `${currency} ${Number(
                    value
                  ).toLocaleString()}`
                }
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#aa3bff"
                strokeWidth={3}
                name="Revenue"
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="profit"
                stroke="#22a06b"
                strokeWidth={3}
                name="Profit"
                dot={{ r: 4 }}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

      {/* =========================
          DASHBOARD GRID
      ========================= */}

      <div className="dashboard-grid">

        {/* =========================
            RECENT PRODUCTS
        ========================= */}

        <div className="dashboard-card">

          <h2>
            🆕 Recent Products
          </h2>

          {recentProducts.length === 0 ? (

            <p>
              No products yet
            </p>

          ) : (

            recentProducts.map(
              (product) => (

                <div
                  className="dashboard-item"
                  key={product.id}
                >

                  <div className="product-info">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        className="dashboard-product-image"
                      />

                    ) : (

                      <div className="dashboard-product-placeholder">
                        📦
                      </div>

                    )}

                    <span>
                      {product.name}
                    </span>

                  </div>

                  <span>
                    {getTotalStock(product)}
                    {" "}
                    pcs
                  </span>

                </div>

              )
            )

          )}

        </div>

        {/* =========================
            STOCK ALERTS
        ========================= */}

        <div className="dashboard-card">

          <h2>
            ⚠️ Stock Alerts
          </h2>

          {lowStockProducts.length === 0 ? (

            <p>
              Everything is well stocked 🎉
            </p>

          ) : (

            lowStockProducts.map(
              (product) => (

                <div
                  className="dashboard-item warning"
                  key={product.id}
                >

                  <span>
                    {product.name}
                  </span>

                  <span>
                    {getTotalStock(product)}
                    {" "}
                    left
                  </span>

                </div>

              )
            )

          )}

        </div>

        {/* =========================
            CATEGORIES
        ========================= */}

        <div className="dashboard-card">

          <h2>
            🏷 Categories
          </h2>

          {Object.keys(
            categories
          ).length === 0 ? (

            <p>
              No categories yet
            </p>

          ) : (

            Object.entries(
              categories
            ).map(
              ([category, count]) => (

                <div
                  className="dashboard-item"
                  key={category}
                >

                  <span>
                    {category}
                  </span>

                  <span>
                    {count} products
                  </span>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

