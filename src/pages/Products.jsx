import { useEffect, useState } from "react";
import "./Products.css";

import SearchBar from "../components/SearchBar/SearchBar";
import ProductTable from "../components/ProductTable/ProductTable";
import ProductForm from "../components/ProductForm/ProductForm";
import SalesModal from "../components/SalesModal/SalesModal";
import SalesHistory from "../components/SalesHistory/SalesHistory";


function Products() {


  const [products, setProducts] = useState(() => {

    try {

      const savedProducts =
        localStorage.getItem("products");

      return savedProducts
        ? JSON.parse(savedProducts)
        : [];

    } catch (error) {

      console.log(error);

      return [];

    }

  });


  const [sales, setSales] = useState(() => {

    const savedSales =
      localStorage.getItem("sales");

    return savedSales
      ? JSON.parse(savedSales)
      : [];

  });


  const [isModalOpen, setIsModalOpen] =
    useState(false);


  const [editingProduct, setEditingProduct] =
    useState(null);


  const [searchTerm, setSearchTerm] =
    useState("");


  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");


  const [saleProduct, setSaleProduct] =
    useState(null);


  const [isSaleOpen, setIsSaleOpen] =
    useState(false);


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
  // ADD PRODUCT
  // =========================

  const addProduct = (product) => {

    setProducts((prev) => {

      const updatedProducts = [
        ...prev,
        product
      ];

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      window.dispatchEvent(
        new Event("productsUpdated")
      );

      return updatedProducts;

    });

    setIsModalOpen(false);

  };


  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = (updatedProduct) => {

    setProducts((prev) => {

      const updatedProducts =
        prev.map((product) =>

          product.id === updatedProduct.id
            ? updatedProduct
            : product

        );

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      window.dispatchEvent(
        new Event("productsUpdated")
      );

      return updatedProducts;

    });

    setEditingProduct(null);

    setIsModalOpen(false);

  };


  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = (id) => {

    setProducts((prev) => {

      const updatedProducts =
        prev.filter(
          (product) =>
            product.id !== id
        );

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      window.dispatchEvent(
        new Event("productsUpdated")
      );

      return updatedProducts;

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

      const updatedProducts =
        prev.map((product) => {

          if (product.id === id) {

            return {

              ...product,

              quantity:
                Math.max(
                  0,
                  Number(
                    product.quantity
                  ) + amount
                )

            };

          }

          return product;

        });


      localStorage.setItem(
        "products",
        JSON.stringify(
          updatedProducts
        )
      );


      window.dispatchEvent(
        new Event("productsUpdated")
      );


      return updatedProducts;

    });

  };


  // =========================
  // SELL PRODUCT
  // =========================

  const sellProduct = (
    product,
    quantity
  ) => {

    const revenue =
      Number(
        product.sellingPrice
      ) * quantity;


    const profit =
      (
        Number(
          product.sellingPrice
        ) -
        Number(
          product.buyingPrice
        )
      ) * quantity;


    const newSale = {

      id: Date.now(),

      productId:
        product.id,

      productName:
        product.name,

      quantity,

      revenue,

      profit,

      date:
        new Date()
          .toLocaleDateString()

    };


    setSales((prev) => {

      const updatedSales = [
        ...prev,
        newSale
      ];

      localStorage.setItem(
        "sales",
        JSON.stringify(
          updatedSales
        )
      );

      window.dispatchEvent(
        new Event("salesUpdated")
      );

      return updatedSales;

    });


    setProducts((prev) => {

      const updatedProducts =
        prev.map((item) => {

          if (
            item.id === product.id
          ) {

            return {

              ...item,

              quantity:
                Number(
                  item.quantity
                ) - quantity

            };

          }

          return item;

        });


      localStorage.setItem(
        "products",
        JSON.stringify(
          updatedProducts
        )
      );


      window.dispatchEvent(
        new Event("productsUpdated")
      );


      return updatedProducts;

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


    if (!saleToDelete) {
      return;
    }


    // Remove sale

    setSales((prev) => {

      const updatedSales =
        prev.filter(
          (sale) =>
            sale.id !== saleId
        );


      localStorage.setItem(
        "sales",
        JSON.stringify(
          updatedSales
        )
      );


      window.dispatchEvent(
        new Event("salesUpdated")
      );


      return updatedSales;

    });


    // Return sold quantity
    // back to stock

    setProducts((prev) => {

      const updatedProducts =
        prev.map((product) => {

          if (
            product.id ===
            saleToDelete.productId
          ) {

            return {

              ...product,

              quantity:
                Number(
                  product.quantity
                ) +
                Number(
                  saleToDelete.quantity
                )

            };

          }


          return product;

        });


      localStorage.setItem(
        "products",
        JSON.stringify(
          updatedProducts
        )
      );


      window.dispatchEvent(
        new Event("productsUpdated")
      );


      return updatedProducts;

    });

  };


  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    products.filter(
      (product) => {

        const matchesSearch =
          product.name
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

            setEditingProduct(
              null
            );

            setIsModalOpen(
              true
            );

          }}
        >

          + Add Product

        </button>


      </div>


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


      <SalesHistory

        sales={
          sales
        }

        onDeleteSale={
          deleteSale
        }

      />


    </div>

  );

}


export default Products;

