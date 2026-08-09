import { useState } from "react";
import "./ProductTable.css";

import {
  FaEdit,
  FaTrash,
  FaShoppingCart
} from "react-icons/fa";


function ProductTable({
  products,
  onDelete,
  onEdit,
  onStockUpdate,
  onSell
}) {


  const [productToDelete, setProductToDelete] =
    useState(null);


  // =========================
  // GET STOCK STATUS
  // =========================

  const getStatus = (quantity) => {

    if (quantity === 0) {

      return {
        text: "Out of Stock",
        className: "out-stock"
      };

    }


    if (quantity <= 10) {

      return {
        text: "Low Stock",
        className: "low-stock"
      };

    }


    return {
      text: "In Stock",
      className: "in-stock"
    };

  };


  // =========================
  // CONFIRM DELETE
  // =========================

  const confirmDelete = () => {

    if (!productToDelete) {
      return;
    }


    onDelete(
      productToDelete.id
    );


    setProductToDelete(null);

  };


  return (

    <>

      <table className="product-table">


        {/* =========================
            TABLE HEADER
        ========================= */}

        <thead>

          <tr>

            <th>Image</th>

            <th>Product</th>

            <th>Brand</th>

            <th>Category</th>

            <th>Shelf</th>

            <th>Store / Box</th>

            <th>Total</th>

            <th>Buying</th>

            <th>Selling</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>


        {/* =========================
            TABLE BODY
        ========================= */}

        <tbody>


          {products.length === 0 ? (

            <tr>

              <td colSpan="11">

                No products available.

              </td>

            </tr>

          ) : (

            products.map((product) => {


              // Make sure old products
              // don't break the table

              const shelfQuantity =
                Number(
                  product.shelfQuantity
                ) || 0;


              const storeQuantity =
                Number(
                  product.storeQuantity
                ) || 0;


              // Total stock

              const totalQuantity =
                shelfQuantity +
                storeQuantity;


              // Status based on TOTAL stock

              const status =
                getStatus(
                  totalQuantity
                );


              return (

                <tr
                  key={product.id}
                >


                  {/* =========================
                      IMAGE
                  ========================= */}

                  <td>

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />

                    ) : (

                      <div
                        className="no-product-image"
                      >

                        📦

                      </div>

                    )}

                  </td>


                  {/* =========================
                      PRODUCT
                  ========================= */}

                  <td>

                    {product.name}

                  </td>


                  {/* =========================
                      BRAND
                  ========================= */}

                  <td>

                    {product.brand || "—"}

                  </td>


                  {/* =========================
                      CATEGORY
                  ========================= */}

                  <td>

                    {product.category}

                  </td>


                  {/* =========================
                      SHELF
                  ========================= */}

                  <td>

                    <span className="stock-number shelf-stock">

                      {shelfQuantity}

                    </span>

                  </td>


                  {/* =========================
                      STORE / BOX
                  ========================= */}

                  <td>

                    <span className="stock-number store-stock">

                      {storeQuantity}

                    </span>

                  </td>


                  {/* =========================
                      TOTAL
                  ========================= */}

                  <td>

                    <strong className="total-stock">

                      {totalQuantity}

                    </strong>

                  </td>


                  {/* =========================
                      BUYING PRICE
                  ========================= */}

                  <td>

                    KSh{" "}

                    {Number(
                      product.buyingPrice
                    ).toLocaleString()}

                  </td>


                  {/* =========================
                      SELLING PRICE
                  ========================= */}

                  <td>

                    KSh{" "}

                    {Number(
                      product.sellingPrice
                    ).toLocaleString()}

                  </td>


                  {/* =========================
                      STATUS
                  ========================= */}

                  <td>

                    <span
                      className={
                        `status ${status.className}`
                      }
                    >

                      {status.text}

                    </span>

                  </td>


                  {/* =========================
                      ACTIONS
                  ========================= */}

                  <td className="actions">


                    {/* STOCK IN */}

                    <button

                      className="stock-in-btn"

                      onClick={() =>
                        onStockUpdate(
                          product.id,
                          1
                        )
                      }

                      title="Add stock"

                    >

                      +

                    </button>


                    {/* STOCK OUT */}

                    <button

                      className="stock-out-btn"

                      onClick={() =>
                        onStockUpdate(
                          product.id,
                          -1
                        )
                      }

                      title="Remove stock"

                    >

                      -

                    </button>


                    {/* SELL */}

                    <button

                      className="sell-btn"

                      onClick={() =>
                        onSell(product)
                      }

                      title="Sell product"

                    >

                      <FaShoppingCart />

                    </button>


                    {/* EDIT */}

                    <button

                      className="edit-btn"

                      onClick={() =>
                        onEdit(product)
                      }

                      title="Edit product"

                    >

                      <FaEdit />

                    </button>


                    {/* DELETE */}

                    <button

                      className="delete-btn"

                      onClick={() =>
                        setProductToDelete(
                          product
                        )
                      }

                      title="Delete product"

                    >

                      <FaTrash />

                    </button>


                  </td>


                </tr>

              );

            })

          )}


        </tbody>

      </table>


      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      {productToDelete && (

        <div className="delete-overlay">


          <div className="delete-modal">


            <div className="delete-icon">

              ⚠️

            </div>


            <h2>

              Delete Product?

            </h2>


            <p>

              Are you sure you want to
              delete{" "}

              <strong>
                "{productToDelete.name}"
              </strong>

              ?

            </p>


            <p className="delete-warning">

              This action cannot be undone.

            </p>


            <div
              className="delete-modal-buttons"
            >


              <button

                className="cancel-delete-btn"

                onClick={() =>
                  setProductToDelete(
                    null
                  )
                }

              >

                Cancel

              </button>


              <button

                className="confirm-delete-btn"

                onClick={
                  confirmDelete
                }

              >

                <FaTrash />

                Delete

              </button>


            </div>


          </div>


        </div>

      )}

    </>

  );

}


export default ProductTable;

