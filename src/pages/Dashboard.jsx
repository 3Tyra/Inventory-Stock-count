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


function Dashboard() {


  const [products, setProducts] =
    useState([]);

  const [sales, setSales] =
    useState([]);


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    const loadData = () => {

      const savedProducts =
        localStorage.getItem("products");

      const savedSales =
        localStorage.getItem("sales");


      setProducts(
        savedProducts
          ? JSON.parse(savedProducts)
          : []
      );


      setSales(
        savedSales
          ? JSON.parse(savedSales)
          : []
      );

    };


    loadData();


    window.addEventListener(
      "productsUpdated",
      loadData
    );


    window.addEventListener(
      "salesUpdated",
      loadData
    );


    return () => {

      window.removeEventListener(
        "productsUpdated",
        loadData
      );

      window.removeEventListener(
        "salesUpdated",
        loadData
      );

    };

  }, []);


  // =========================
  // LOW STOCK SETTINGS
  // =========================

  const savedSettings =
    JSON.parse(
      localStorage.getItem("settings")
    ) || {};


  const lowStockLimit =
    Number(
      savedSettings.lowStockLimit
    ) || 10;


  // =========================
  // HELPER
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


    // New products
    // Shelf + Store/Box

    if (
      product.shelfQuantity !== undefined ||
      product.storeQuantity !== undefined
    ) {

      return (
        shelfQuantity +
        storeQuantity
      );

    }


    // Support old products

    return Number(
      product.quantity
    ) || 0;

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
          (
            Number(
              product.buyingPrice || 0
            ) *
            quantity
          )
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
            (
              Number(
                product.sellingPrice || 0
              ) -
              Number(
                product.buyingPrice || 0
              )
            ) *
            quantity
          )
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


  products.forEach((product) => {

    if (categories[product.category]) {

      categories[product.category]++;

    } else {

      categories[product.category] = 1;

    }

  });


  // =========================
  // RECENT PRODUCTS
  // =========================

  const recentProducts =
    [...products]
      .reverse()
      .slice(0, 5);


  // =========================
  // SALES CHART DATA
  // =========================

  const chartData = {};


  sales.forEach((sale) => {

    const date =
      sale.date;


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

  });


  const salesChartData =
    Object.values(
      chartData
    );


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
            KSh{" "}
            {inventoryValue.toLocaleString()}
          </h2>

        </div>


        {/* POTENTIAL PROFIT */}

        <div className="stat-card">

          <h3>
            📈 Potential Profit
          </h3>

          <h2>
            KSh{" "}
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
            KSh{" "}
            {totalRevenue.toLocaleString()}
          </h2>

        </div>


        {/* PROFIT MADE */}

        <div className="stat-card">

          <h3>
            📈 Profit Made
          </h3>

          <h2>
            KSh{" "}
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
                  `KSh ${Number(
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


          {Object.keys(categories).length === 0 ? (

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