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

        <thead>

          <tr>

            <th>Product</th>

            <th>Brand</th>

            <th>Category</th>

            <th>Qty</th>

            <th>Buying</th>

            <th>Selling</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>


        <tbody>


          {products.length === 0 ? (

            <tr>

              <td colSpan="8">

                No products available.

              </td>

            </tr>

          ) : (

            products.map((product) => {


              const status =
                getStatus(
                  Number(
                    product.quantity
                  )
                );


              return (

                <tr
                  key={product.id}
                >


                  <td>
                    {product.name}
                  </td>


                  <td>
                    {product.brand}
                  </td>


                  <td>
                    {product.category}
                  </td>


                  <td>
                    {product.quantity}
                  </td>


                  <td>
                    KSh{" "}
                    {Number(
                      product.buyingPrice
                    ).toLocaleString()}
                  </td>


                  <td>
                    KSh{" "}
                    {Number(
                      product.sellingPrice
                    ).toLocaleString()}
                  </td>


                  <td>

                    <span
                      className={
                        `status ${status.className}`
                      }
                    >

                      {status.text}

                    </span>

                  </td>


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


      {/* DELETE CONFIRMATION MODAL */}

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


            <div className="delete-modal-buttons">


              <button
                className="cancel-delete-btn"
                onClick={() =>
                  setProductToDelete(null)
                }
              >

                Cancel

              </button>


              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
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

