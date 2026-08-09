import { useEffect, useState } from "react";
import "./Products.css";

import SearchBar from "../components/SearchBar/SearchBar";
import ProductTable from "../components/ProductTable/ProductTable";
import ProductForm from "../components/ProductForm/ProductForm";
import SalesModal from "../components/SalesModal/SalesModal";
import SalesHistory from "../components/SalesHistory/SalesHistory";
import StockHistory from "../components/StockHistory/StockHistory";


function Products() {

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState(() => {

    try {

      const savedProducts =
        localStorage.getItem("products");

      const parsedProducts = savedProducts
        ? JSON.parse(savedProducts)
        : [];


      return parsedProducts.map((product) => {

        const shelfQuantity =
          Number(product.shelfQuantity) || 0;

        const storeQuantity =
          Number(product.storeQuantity) ||
          (
            Number(product.quantity) || 0
          );


        return {

          ...product,

          shelfQuantity,

          storeQuantity,

          quantity:
            shelfQuantity +
            storeQuantity

        };

      });

    } catch (error) {

      console.log(error);

      return [];

    }

  });


  // =========================
  // SALES
  // =========================

  const [sales, setSales] = useState(() => {

    try {

      const savedSales =
        localStorage.getItem("sales");

      return savedSales
        ? JSON.parse(savedSales)
        : [];

    } catch (error) {

      console.log(error);

      return [];

    }

  });


  // =========================
  // STOCK HISTORY
  // =========================

  const [stockHistory, setStockHistory] =
    useState(() => {

      try {

        const savedHistory =
          localStorage.getItem(
            "stockHistory"
          );

        return savedHistory
          ? JSON.parse(savedHistory)
          : [];

      } catch (error) {

        console.log(error);

        return [];

      }

    });


  // =========================
  // MODALS
  // =========================

  const [isModalOpen, setIsModalOpen] =
    useState(false);


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
  // SAVE PRODUCTS
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );


    window.dispatchEvent(
      new Event("productsUpdated")
    );

  }, [products]);


  // =========================
  // SAVE SALES
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "sales",
      JSON.stringify(sales)
    );


    window.dispatchEvent(
      new Event("salesUpdated")
    );

  }, [sales]);


  // =========================
  // SAVE STOCK HISTORY
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "stockHistory",
      JSON.stringify(stockHistory)
    );


    window.dispatchEvent(
      new Event("stockHistoryUpdated")
    );

  }, [stockHistory]);


  // =========================
  // ADD STOCK HISTORY RECORD
  // =========================

  const addStockHistory = ({
    product,
    action,
    quantity,
    location
  }) => {

    const historyRecord = {

      id:
        Date.now() + Math.random(),

      productId:
        product.id,

      productName:
        product.name,

      action,

      quantity,

      location,

      date:
        new Date().toLocaleDateString(),

      time:
        new Date().toLocaleTimeString()

    };


    setStockHistory((prev) => {

      return [
        historyRecord,
        ...prev
      ];

    });

  };


  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = (product) => {

    const shelfQuantity =
      Number(
        product.shelfQuantity
      ) || 0;


    const storeQuantity =
      Number(
        product.storeQuantity
      ) || 0;


    const totalQuantity =
      shelfQuantity +
      storeQuantity;


    const newProduct = {

      ...product,

      shelfQuantity,

      storeQuantity,

      quantity:
        totalQuantity

    };


    setProducts((prev) => {

      return [

        ...prev,

        newProduct

      ];

    });


    // Record initial stock

    if (shelfQuantity > 0) {

      addStockHistory({

        product:
          newProduct,

        action:
          "Initial Stock",

        quantity:
          shelfQuantity,

        location:
          "Shelf"

      });

    }


    if (storeQuantity > 0) {

      addStockHistory({

        product:
          newProduct,

        action:
          "Initial Stock",

        quantity:
          storeQuantity,

        location:
          "Store / Box"

      });

    }


    setIsModalOpen(false);

  };


  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = (
    updatedProduct
  ) => {

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


    const updatedProductData = {

      ...updatedProduct,

      shelfQuantity,

      storeQuantity,

      quantity:
        totalQuantity

    };


    setProducts((prev) => {

      return prev.map((product) =>

        product.id ===
        updatedProduct.id

          ? updatedProductData

          : product

      );

    });


    setEditingProduct(null);

    setIsModalOpen(false);

  };


  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = (id) => {

    setProducts((prev) => {

      return prev.filter(
        (product) =>
          product.id !== id
      );

    });

  };


  // =========================
  // STOCK IN / STOCK OUT
  // =========================

  const updateStock = (
    id,
    amount
  ) => {

    setProducts((prev) => {

      return prev.map((product) => {

        if (
          product.id !== id
        ) {

          return product;

        }


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

          storeQuantity +=
            amount;


          addStockHistory({

            product,

            action:
              "Stock Added",

            quantity:
              amount,

            location:
              "Store / Box"

          });

        }


        // =========================
        // STOCK OUT
        // =========================

        if (amount < 0) {

          const amountToRemove =
            Math.abs(amount);


          // Remove from store first

          if (
            storeQuantity >=
            amountToRemove
          ) {

            storeQuantity -=
              amountToRemove;


            addStockHistory({

              product,

              action:
                "Stock Removed",

              quantity:
                amountToRemove,

              location:
                "Store / Box"

            });

          } else {

            const removedFromStore =
              storeQuantity;


            const remaining =
              amountToRemove -
              storeQuantity;


            storeQuantity = 0;


            const removedFromShelf =
              Math.min(
                shelfQuantity,
                remaining
              );


            shelfQuantity =
              Math.max(
                0,
                shelfQuantity -
                remaining
              );


            if (
              removedFromStore > 0
            ) {

              addStockHistory({

                product,

                action:
                  "Stock Removed",

                quantity:
                  removedFromStore,

                location:
                  "Store / Box"

              });

            }


            if (
              removedFromShelf > 0
            ) {

              addStockHistory({

                product,

                action:
                  "Stock Removed",

                quantity:
                  removedFromShelf,

                location:
                  "Shelf"

              });

            }

          }

        }


        const totalQuantity =
          shelfQuantity +
          storeQuantity;


        return {

          ...product,

          shelfQuantity,

          storeQuantity,

          quantity:
            totalQuantity

        };

      });

    });

  };


  // =========================
  // SELL PRODUCT
  // =========================

  const sellProduct = (
    product,
    quantity
  ) => {

    const soldQuantity =
      Number(quantity);


    if (
      !soldQuantity ||
      soldQuantity <= 0
    ) {

      return;

    }


    const availableStock =
      Number(
        product.shelfQuantity || 0
      ) +
      Number(
        product.storeQuantity || 0
      );


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


    const newSale = {

      id:
        Date.now(),

      productId:
        product.id,

      productName:
        product.name,

      quantity:
        soldQuantity,

      revenue,

      profit,

      date:
        new Date()
          .toLocaleDateString()

    };


    // =========================
    // ADD SALE
    // =========================

    setSales((prev) => {

      return [

        ...prev,

        newSale

      ];

    });


    // =========================
    // REMOVE SOLD STOCK
    // =========================

    setProducts((prev) => {

      return prev.map((item) => {

        if (
          item.id !==
          product.id
        ) {

          return item;

        }


        let shelfQuantity =
          Number(
            item.shelfQuantity
          ) || 0;


        let storeQuantity =
          Number(
            item.storeQuantity
          ) || 0;


        let remaining =
          soldQuantity;


        // =========================
        // REMOVE FROM SHELF FIRST
        // =========================

        if (
          shelfQuantity >=
          remaining
        ) {

          shelfQuantity -=
            remaining;


          addStockHistory({

            product:
              item,

            action:
              "Sold",

            quantity:
              remaining,

            location:
              "Shelf"

          });


          remaining = 0;

        } else {

          const removedFromShelf =
            shelfQuantity;


          remaining -=
            shelfQuantity;


          shelfQuantity = 0;


          if (
            removedFromShelf > 0
          ) {

            addStockHistory({

              product:
                item,

              action:
                "Sold",

              quantity:
                removedFromShelf,

              location:
                "Shelf"

            });

          }

        }


        // =========================
        // REMOVE REST FROM STORE
        // =========================

        if (
          remaining > 0
        ) {

          const removedFromStore =
            Math.min(
              storeQuantity,
              remaining
            );


          storeQuantity -=
            removedFromStore;


          addStockHistory({

            product:
              item,

            action:
              "Sold",

            quantity:
              removedFromStore,

            location:
              "Store / Box"

          });

        }


        const totalQuantity =
          shelfQuantity +
          storeQuantity;


        return {

          ...item,

          shelfQuantity,

          storeQuantity,

          quantity:
            totalQuantity

        };

      });

    });

  };


  // =========================
  // DELETE SALE
  // =========================

  const deleteSale = (
    saleId
  ) => {

    const saleToDelete =
      sales.find(
        (sale) =>
          sale.id === saleId
      );


    if (
      !saleToDelete
    ) {

      return;

    }


    // Remove sale

    setSales((prev) => {

      return prev.filter(
        (sale) =>
          sale.id !== saleId
      );

    });


    // Restore quantity
    // back to shelf

    setProducts((prev) => {

      return prev.map((product) => {

        if (
          product.id !==
          saleToDelete.productId
        ) {

          return product;

        }


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
          );


        const restoredShelf =
          shelfQuantity +
          restoredQuantity;


        addStockHistory({

          product,

          action:
            "Sale Reversed",

          quantity:
            restoredQuantity,

          location:
            "Shelf"

        });


        return {

          ...product,

          shelfQuantity:
            restoredShelf,

          storeQuantity,

          quantity:
            restoredShelf +
            storeQuantity

        };

      });

    });

  };


  // =========================
  // DELETE STOCK HISTORY
  // =========================

  const deleteHistory = (
    historyId
  ) => {

    setStockHistory((prev) => {

      return prev.filter(
        (record) =>
          record.id !== historyId
      );

    });

  };


  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    products.filter(
      (product) => {

        const productName =
          product.name || "";


        const matchesSearch =
          productName
            .toLowerCase()
            .includes(
              searchTerm
                .toLowerCase()
            );


        const matchesCategory =
          categoryFilter ===
            "All Categories"
          ||
          product.category ===
            categoryFilter;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );


  // =========================
  // PAGE
  // =========================

  return (

    <div className="products">


      {/* =========================
          HEADER
      ========================= */}

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


      {/* =========================
          SEARCH
      ========================= */}

      <SearchBar

        searchTerm={
          searchTerm
        }

        setSearchTerm={
          setSearchTerm
        }

        categoryFilter={
          categoryFilter
        }

        setCategoryFilter={
          setCategoryFilter
        }

      />


      {/* =========================
          PRODUCT TABLE
      ========================= */}

      <div className="product-table-wrapper">

        <ProductTable

          products={
            filteredProducts
          }

          onDelete={
            deleteProduct
          }

          onStockUpdate={
            updateStock
          }


          onSell={(product) => {

            setSaleProduct(
              product
            );

            setIsSaleOpen(
              true
            );

          }}


          onEdit={(product) => {

            setEditingProduct(
              product
            );

            setIsModalOpen(
              true
            );

          }}

        />

      </div>


      {/* =========================
          PRODUCT FORM
      ========================= */}

      <ProductForm

        isOpen={
          isModalOpen
        }

        editingProduct={
          editingProduct
        }


        onClose={() => {

          setIsModalOpen(
            false
          );

          setEditingProduct(
            null
          );

        }}


        onSave={
          addProduct
        }

        onUpdate={
          updateProduct
        }

      />


      {/* =========================
          SALES MODAL
      ========================= */}

      <SalesModal

        product={
          saleProduct
        }

        isOpen={
          isSaleOpen
        }


        onClose={() => {

          setIsSaleOpen(
            false
          );

          setSaleProduct(
            null
          );

        }}


        onSell={
          sellProduct
        }

      />


      {/* =========================
          SALES HISTORY
      ========================= */}

      <SalesHistory

        sales={
          sales
        }

        onDeleteSale={
          deleteSale
        }

      />


      {/* =========================
          STOCK HISTORY
      ========================= */}

      <StockHistory

        history={
          stockHistory
        }

        onDeleteHistory={
          deleteHistory
        }

      />


    </div>

  );

}


export default Products;