
import { useEffect, useState } from "react";
import "./Products.css";

import SearchBar from "../components/SearchBar/SearchBar";
import ProductTable from "../components/ProductTable/ProductTable";
import ProductForm from "../components/ProductForm/ProductForm";
import SalesModal from "../components/SalesModal/SalesModal";
import SalesHistory from "../components/SalesHistory/SalesHistory";
import StockHistory from "../components/StockHistory/StockHistory";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { user } = useAuth();

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);

  // =========================
  // SALES
  // =========================

  const [sales, setSales] = useState([]);

  // =========================
  // STOCK HISTORY
  // =========================

  const [stockHistory, setStockHistory] = useState([]);

  // =========================
  // MODALS
  // =========================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [saleProduct, setSaleProduct] =
    useState(null);

  const [isSaleOpen, setIsSaleOpen] =
    useState(false);

  // =========================
  // SEARCH
  // =========================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  // =========================
  // LOAD EVERYTHING
  // =========================

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setSales([]);
      setStockHistory([]);
      return;
    }

    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // =========================
      // PRODUCTS
      // =========================

      const {
        data: productData,
        error: productError,
      } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (productError) {
        console.error(
          "Products error:",
          productError
        );
      } else {
        const formattedProducts =
          (productData || []).map((product) => {
            const shelfQuantity =
              Number(product.shelf_quantity) || 0;

            const storeQuantity =
              Number(product.store_quantity) || 0;

            return {
              ...product,

              shelfQuantity,

              storeQuantity,

              buyingPrice:
                Number(product.buying_price) || 0,

              sellingPrice:
                Number(product.selling_price) || 0,

              quantity:
                shelfQuantity +
                storeQuantity,
            };
          });

        setProducts(formattedProducts);
      }

      // =========================
      // SALES
      // =========================

      const {
        data: salesData,
        error: salesError,
      } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (salesError) {
        console.error(
          "Sales error:",
          salesError
        );
      } else {
        setSales(salesData || []);
      }

      // =========================
      // STOCK HISTORY
      // =========================

      const {
        data: historyData,
        error: historyError,
      } = await supabase
        .from("stock_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (historyError) {
        console.error(
          "Stock history error:",
          historyError
        );
      } else {
        setStockHistory(historyData || []);
      }
    } catch (error) {
      console.error(
        "Loading data failed:",
        error
      );
    }
  };

  // =========================
  // ADD STOCK HISTORY
  // =========================

  const addStockHistory = async ({
    product,
    action,
    quantity,
    location,
  }) => {
    if (!user) return;

    const now = new Date();

    const historyRecord = {
      user_id: user.id,

      product_id: product.id,

      product_name: product.name,

      action,

      quantity: Number(quantity) || 0,

      location,

      date: now.toLocaleDateString(),

      time: now.toLocaleTimeString(),
    };

    const {
      data,
      error,
    } = await supabase
      .from("stock_history")
      .insert(historyRecord)
      .select()
      .single();

    if (error) {
      console.error(
        "Stock history error:",
        error
      );
      return;
    }

    setStockHistory((prev) => [
      data,
      ...prev,
    ]);
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = async (product) => {
    if (!user) return;

    const shelfQuantity =
      Number(product.shelfQuantity) || 0;

    const storeQuantity =
      Number(product.storeQuantity) || 0;

    const totalQuantity =
      shelfQuantity +
      storeQuantity;

    const newProduct = {
      user_id: user.id,

      name: product.name,

      brand: product.brand || null,

      category: product.category || null,

      image: product.image || null,

      shelf_quantity:
        shelfQuantity,

      store_quantity:
        storeQuantity,

      quantity:
        totalQuantity,

      buying_price:
        Number(product.buyingPrice) || 0,

      selling_price:
        Number(product.sellingPrice) || 0,
    };

    const {
      data,
      error,
    } = await supabase
      .from("products")
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error(
        "Add product error:",
        error
      );

      alert(
        "Could not add product: " +
        error.message
      );

      return;
    }

    const formattedProduct = {
      ...data,

      shelfQuantity:
        Number(data.shelf_quantity) || 0,

      storeQuantity:
        Number(data.store_quantity) || 0,

      buyingPrice:
        Number(data.buying_price) || 0,

      sellingPrice:
        Number(data.selling_price) || 0,

      quantity:
        (Number(data.shelf_quantity) || 0) +
        (Number(data.store_quantity) || 0),
    };

    setProducts((prev) => [
      formattedProduct,
      ...prev,
    ]);

    // =========================
    // INITIAL STOCK HISTORY
    // =========================

    if (shelfQuantity > 0) {
      await addStockHistory({
        product: formattedProduct,

        action: "Initial Stock",

        quantity: shelfQuantity,

        location: "Shelf",
      });
    }

    if (storeQuantity > 0) {
      await addStockHistory({
        product: formattedProduct,

        action: "Initial Stock",

        quantity: storeQuantity,

        location: "Store / Box",
      });
    }

    setIsModalOpen(false);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = async (
    updatedProduct
  ) => {
    if (!user) return;

    const shelfQuantity =
      Number(
        updatedProduct.shelfQuantity
      ) || 0;

    const storeQuantity =
      Number(
        updatedProduct.storeQuantity
      ) || 0;

    const totalQuantity =
      shelfQuantity +
      storeQuantity;

    const updateData = {
      name: updatedProduct.name,

      brand:
        updatedProduct.brand || null,

      category:
        updatedProduct.category || null,

      image:
        updatedProduct.image || null,

      shelf_quantity:
        shelfQuantity,

      store_quantity:
        storeQuantity,

      quantity:
        totalQuantity,

      buying_price:
        Number(
          updatedProduct.buyingPrice
        ) || 0,

      selling_price:
        Number(
          updatedProduct.sellingPrice
        ) || 0,
    };

    const {
      data,
      error,
    } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", updatedProduct.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Update product error:",
        error
      );

      alert(
        "Could not update product: " +
        error.message
      );

      return;
    }

    const formattedProduct = {
      ...data,

      shelfQuantity:
        Number(data.shelf_quantity) || 0,

      storeQuantity:
        Number(data.store_quantity) || 0,

      buyingPrice:
        Number(data.buying_price) || 0,

      sellingPrice:
        Number(data.selling_price) || 0,

      quantity:
        (Number(data.shelf_quantity) || 0) +
        (Number(data.store_quantity) || 0),
    };

    setProducts((prev) =>
      prev.map((product) =>
        product.id ===
        updatedProduct.id
          ? formattedProduct
          : product
      )
    );

    setEditingProduct(null);

    setIsModalOpen(false);
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {
    if (!user) return;

    const {
      error,
    } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        "Could not delete product."
      );

      return;
    }

    setProducts((prev) =>
      prev.filter(
        (product) =>
          product.id !== id
      )
    );

    // Remove related history from UI
    setStockHistory((prev) =>
      prev.filter(
        (record) =>
          record.product_id !== id
      )
    );
  };

  // =========================
  // STOCK IN / STOCK OUT
  // =========================

  const updateStock = async (
    id,
    amount
  ) => {
    if (!user) return;

    const product =
      products.find(
        (item) =>
          item.id === id
      );

    if (!product) return;

    let shelfQuantity =
      Number(
        product.shelfQuantity
      ) || 0;

    let storeQuantity =
      Number(
        product.storeQuantity
      ) || 0;

    // =========================
    // STOCK IN
    // =========================

    if (amount > 0) {
      storeQuantity += amount;

      const totalQuantity =
        shelfQuantity +
        storeQuantity;

      const {
        error,
      } = await supabase
        .from("products")
        .update({
          shelf_quantity:
            shelfQuantity,

          store_quantity:
            storeQuantity,

          quantity:
            totalQuantity,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Stock in error:",
          error
        );

        alert(
          "Could not update stock."
        );

        return;
      }

      await addStockHistory({
        product,

        action: "Stock Added",

        quantity: amount,

        location: "Store / Box",
      });
    }

    // =========================
    // STOCK OUT
    // =========================

    if (amount < 0) {
      const amountToRemove =
        Math.abs(amount);

      const availableStock =
        shelfQuantity +
        storeQuantity;

      if (
        amountToRemove >
        availableStock
      ) {
        alert(
          "Not enough stock available."
        );

        return;
      }

      let remaining =
        amountToRemove;

      // Remove from store first

      if (
        storeQuantity >=
        remaining
      ) {
        storeQuantity -=
          remaining;

        await addStockHistory({
          product,

          action: "Stock Removed",

          quantity: remaining,

          location: "Store / Box",
        });

        remaining = 0;
      } else {
        const removedFromStore =
          storeQuantity;

        remaining -=
          storeQuantity;

        storeQuantity = 0;

        if (
          removedFromStore > 0
        ) {
          await addStockHistory({
            product,

            action:
              "Stock Removed",

            quantity:
              removedFromStore,

            location:
              "Store / Box",
          });
        }
      }

      // Remove from shelf

      if (remaining > 0) {
        const removedFromShelf =
          Math.min(
            shelfQuantity,
            remaining
          );

        shelfQuantity -=
          removedFromShelf;

        if (
          removedFromShelf > 0
        ) {
          await addStockHistory({
            product,

            action:
              "Stock Removed",

            quantity:
              removedFromShelf,

            location:
              "Shelf",
          });
        }
      }

      const totalQuantity =
        shelfQuantity +
        storeQuantity;

      const {
        error,
      } = await supabase
        .from("products")
        .update({
          shelf_quantity:
            shelfQuantity,

          store_quantity:
            storeQuantity,

          quantity:
            totalQuantity,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Stock out error:",
          error
        );

        return;
      }
    }

    await loadData();
  };

  // =========================
  // SELL PRODUCT
  // =========================

  const sellProduct = async (
    product,
    quantity
  ) => {
    if (!user) return;

    const soldQuantity =
      Number(quantity);

    if (
      !soldQuantity ||
      soldQuantity <= 0
    ) {
      return;
    }

    const shelfQuantity =
      Number(
        product.shelfQuantity
      ) || 0;

    const storeQuantity =
      Number(
        product.storeQuantity
      ) || 0;

    const availableStock =
      shelfQuantity +
      storeQuantity;

    if (
      soldQuantity >
      availableStock
    ) {
      alert(
        "Not enough stock available."
      );

      return;
    }

    const revenue =
      Number(
        product.sellingPrice
      ) *
      soldQuantity;

    const profit =
      (
        Number(
          product.sellingPrice
        ) -
        Number(
          product.buyingPrice
        )
      ) *
      soldQuantity;

    const sale = {
      user_id: user.id,

      product_id:
        product.id,

      product_name:
        product.name,

      quantity:
        soldQuantity,

      revenue,

      profit,

      date:
        new Date()
          .toLocaleDateString(),
    };

    // =========================
    // SAVE SALE
    // =========================

    const {
      data: saleData,
      error: saleError,
    } = await supabase
      .from("sales")
      .insert(sale)
      .select()
      .single();

    if (saleError) {
      console.error(
        "Sale error:",
        saleError
      );

      alert(
        "Could not complete sale: " +
        saleError.message
      );

      return;
    }

    setSales((prev) => [
      saleData,
      ...prev,
    ]);

    // =========================
    // REMOVE STOCK
    // =========================

    let newShelfQuantity =
      shelfQuantity;

    let newStoreQuantity =
      storeQuantity;

    let remaining =
      soldQuantity;

    // Shelf first

    if (
      newShelfQuantity >=
      remaining
    ) {
      newShelfQuantity -=
        remaining;

      await addStockHistory({
        product,

        action: "Sold",

        quantity: remaining,

        location: "Shelf",
      });

      remaining = 0;
    } else {
      const removedFromShelf =
        newShelfQuantity;

      remaining -=
        newShelfQuantity;

      newShelfQuantity = 0;

      if (
        removedFromShelf > 0
      ) {
        await addStockHistory({
          product,

          action: "Sold",

          quantity:
            removedFromShelf,

          location: "Shelf",
        });
      }
    }

    // Store

    if (remaining > 0) {
      const removedFromStore =
        Math.min(
          newStoreQuantity,
          remaining
        );

      newStoreQuantity -=
        removedFromStore;

      if (
        removedFromStore > 0
      ) {
        await addStockHistory({
          product,

          action: "Sold",

          quantity:
            removedFromStore,

          location:
            "Store / Box",
        });
      }
    }

    const totalQuantity =
      newShelfQuantity +
      newStoreQuantity;

    const {
      error: stockError,
    } = await supabase
      .from("products")
      .update({
        shelf_quantity:
          newShelfQuantity,

        store_quantity:
          newStoreQuantity,

        quantity:
          totalQuantity,
      })
      .eq("id", product.id)
      .eq("user_id", user.id);

    if (stockError) {
      console.error(
        "Stock update error:",
        stockError
      );

      return;
    }

    await loadData();

    setIsSaleOpen(false);
    setSaleProduct(null);
  };

  // =========================
  // DELETE SALE
  // =========================

  const deleteSale = async (
    saleId
  ) => {
    if (!user) return;

    const saleToDelete =
      sales.find(
        (sale) =>
          sale.id === saleId
      );

    if (!saleToDelete) return;

    const {
      error,
    } = await supabase
      .from("sales")
      .delete()
      .eq("id", saleId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Delete sale error:",
        error
      );

      alert(
        "Could not delete sale."
      );

      return;
    }

    // Restore stock

    const product =
      products.find(
        (item) =>
          item.id ===
          saleToDelete.product_id
      );

    if (product) {
      const shelfQuantity =
        Number(
          product.shelfQuantity
        ) || 0;

      const storeQuantity =
        Number(
          product.storeQuantity
        ) || 0;

      const restoredQuantity =
        Number(
          saleToDelete.quantity
        ) || 0;

      const restoredShelf =
        shelfQuantity +
        restoredQuantity;

      const {
        error:
          restoreError,
      } = await supabase
        .from("products")
        .update({
          shelf_quantity:
            restoredShelf,

          store_quantity:
            storeQuantity,

          quantity:
            restoredShelf +
            storeQuantity,
        })
        .eq(
          "id",
          product.id
        )
        .eq(
          "user_id",
          user.id
        );

      if (restoreError) {
        console.error(
          "Restore stock error:",
          restoreError
        );

        return;
      }

      await addStockHistory({
        product,

        action:
          "Sale Reversed",

        quantity:
          restoredQuantity,

        location:
          "Shelf",
      });
    }

    await loadData();
  };

  // =========================
  // DELETE STOCK HISTORY
  // =========================

  const deleteHistory = async (
    historyId
  ) => {
    if (!user) return;

    const {
      error,
    } = await supabase
      .from("stock_history")
      .delete()
      .eq("id", historyId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Delete history error:",
        error
      );

      alert(
        "Could not delete history."
      );

      return;
    }

    setStockHistory((prev) =>
      prev.filter(
        (record) =>
          record.id !==
          historyId
      )
    );
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    products.filter((product) => {
      const productName =
        product.name || "";

      const matchesSearch =
        productName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesCategory =
        categoryFilter ===
          "All Categories" ||
        product.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =========================
  // PAGE
  // =========================

  return (
    <div className="products">

      {/* HEADER */}

      <div className="products-header">

        <div>
          <h1>
            📦 Products
          </h1>

          <p>
            Manage all electrical
            products.
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          + Add Product
        </button>

      </div>

      {/* SEARCH */}

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={
          setCategoryFilter
        }
      />

      {/* PRODUCT TABLE */}

      <div className="product-table-wrapper">

        <ProductTable
          products={filteredProducts}

          onDelete={deleteProduct}

          onStockUpdate={
            updateStock
          }

          onSell={(product) => {
            setSaleProduct(product);
            setIsSaleOpen(true);
          }}

          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
        />

      </div>

      {/* PRODUCT FORM */}

      <ProductForm
        isOpen={isModalOpen}

        editingProduct={
          editingProduct
        }

        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}

        onSave={addProduct}

        onUpdate={updateProduct}
      />

      {/* SALES MODAL */}

      <SalesModal
        product={saleProduct}

        isOpen={isSaleOpen}

        onClose={() => {
          setIsSaleOpen(false);
          setSaleProduct(null);
        }}

        onSell={sellProduct}
      />

      {/* SALES HISTORY */}

      <SalesHistory
        sales={sales}
        onDeleteSale={
          deleteSale
        }
      />

      {/* STOCK HISTORY */}

      <StockHistory
        history={stockHistory}
        onDeleteHistory={
          deleteHistory
        }
      />

    </div>
  );
}

export default Products;

