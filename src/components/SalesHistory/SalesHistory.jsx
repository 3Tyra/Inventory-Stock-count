import { useState } from "react";
import "./SalesHistory.css";

import {
  FiFileText,
  FiTrash2,
  FiAlertTriangle,
  FiPackage
} from "react-icons/fi";

function SalesHistory({
  sales,
  onDeleteSale
}) {

  const [saleToDelete, setSaleToDelete] =
    useState(null);


  // =========================
  // CONFIRM DELETE
  // =========================

  const confirmDelete = () => {

    if (!saleToDelete) {
      return;
    }

    onDeleteSale(
      saleToDelete.id
    );

    setSaleToDelete(null);

  };


  return (

    <div className="sales-history">


      {/* =========================
          HEADER
      ========================= */}

      <div className="sales-history-header">

        <div>

          <h2>
            <FiFileText />
            Sales History
          </h2>

          <p>
            View all recorded sales.
          </p>

        </div>

      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {sales.length === 0 ? (

        <div className="empty-sales">

          <FiFileText />

          <p>
            No sales recorded yet.
          </p>

          <small>
            Completed sales will appear here.
          </small>

        </div>

      ) : (

        <div className="sales-list">

          {sales
            .slice()
            .reverse()
            .map((sale) => (

              <div
                className="sale-card"
                key={sale.id}
              >


                {/* =========================
                    SALE INFO
                ========================= */}

                <div className="sale-info">

                  <h3>
                    {sale.product_name}
                  </h3>

                  <p>

                    Quantity sold:{" "}

                    <strong>
                      {sale.quantity}
                    </strong>

                  </p>

                  <p>

                    Date:{" "}

                    {sale.date}

                  </p>

                </div>


                {/* =========================
                    SALE MONEY
                ========================= */}

                <div className="sale-money">

                  <p>

                    Revenue:{" "}

                    <strong>

                      KSh{" "}

                      {Number(
                        sale.revenue || 0
                      ).toLocaleString()}

                    </strong>

                  </p>


                  <p>

                    Profit:{" "}

                    <strong>

                      KSh{" "}

                      {Number(
                        sale.profit || 0
                      ).toLocaleString()}

                    </strong>

                  </p>

                </div>


                {/* =========================
                    DELETE BUTTON
                ========================= */}

                <button
                  className="delete-sale-btn"
                  onClick={() =>
                    setSaleToDelete(sale)
                  }
                  title="Delete sale"
                >

                  <FiTrash2 />

                </button>


              </div>

            ))}

        </div>

      )}


      {/* =========================
          DELETE SALE MODAL
      ========================= */}

      {saleToDelete && (

        <div className="sale-delete-overlay">

          <div className="sale-delete-modal">


            <div className="sale-delete-icon">

              <FiAlertTriangle />

            </div>


            <h2>
              Delete Sale?
            </h2>


            <p>

              Are you sure you want to
              delete the sale for{" "}

              <strong>
                "{saleToDelete.product_name}"
              </strong>

              ?

            </p>


            <p className="restore-message">

              <FiPackage />

              {saleToDelete.quantity} item(s)
              will be returned to stock.

            </p>


            <div className="sale-delete-buttons">


              {/* CANCEL */}

              <button
                className="cancel-sale-delete"
                onClick={() =>
                  setSaleToDelete(null)
                }
              >

                Cancel

              </button>


              {/* CONFIRM */}

              <button
                className="confirm-sale-delete"
                onClick={confirmDelete}
              >

                <FiTrash2 />

                Delete Sale

              </button>


            </div>


          </div>

        </div>

      )}

    </div>

  );

}

export default SalesHistory;