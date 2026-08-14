import { useState } from "react";
import "./SalesHistory.css";

import {
  FiFileText,
  FiTrash2,
  FiAlertTriangle,
  FiPackage
} from "react-icons/fi";

function SalesHistory({
  sales = [],
  onDeleteSale
}) {

  const [saleToDelete, setSaleToDelete] =
    useState(null);

  // =========================
  // OPEN DELETE CONFIRMATION
  // =========================

  const handleDeleteClick = (e, sale) => {

    e.preventDefault();
    e.stopPropagation();

    setSaleToDelete(sale);

  };

  // =========================
  // CONFIRM DELETE
  // =========================

  const confirmDelete = () => {

    if (!saleToDelete) {
      return;
    }

    if (
      typeof onDeleteSale !== "function"
    ) {
      console.error(
        "onDeleteSale is not a function"
      );

      return;
    }

    onDeleteSale(
      saleToDelete.id
    );

    setSaleToDelete(null);

  };

  // =========================
  // CANCEL DELETE
  // =========================

  const cancelDelete = (e) => {

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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

                  type="button"

                  className="delete-sale-btn"

                  onClick={(e) =>
                    handleDeleteClick(
                      e,
                      sale
                    )
                  }

                  onTouchEnd={(e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    setSaleToDelete(sale);

                  }}

                  title="Delete sale"

                  aria-label={`Delete sale for ${sale.product_name}`}

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

        <div

          className="sale-delete-overlay"

          onClick={cancelDelete}

        >

          <div

            className="sale-delete-modal"

            onClick={(e) => {
              e.stopPropagation();
            }}

          >

            {/* =========================
                WARNING ICON
            ========================= */}

            <div className="sale-delete-icon">

              <FiAlertTriangle />

            </div>


            {/* =========================
                TITLE
            ========================= */}

            <h2>
              Delete Sale?
            </h2>


            {/* =========================
                MESSAGE
            ========================= */}

            <p>

              Are you sure you want to
              delete the sale for{" "}

              <strong>
                "{saleToDelete.product_name}"
              </strong>

              ?

            </p>


            {/* =========================
                RESTORE MESSAGE
            ========================= */}

            <p className="restore-message">

              <FiPackage />

              <span>

                {saleToDelete.quantity}
                {" "}
                item(s) will be returned
                to stock.

              </span>

            </p>


            {/* =========================
                BUTTONS
            ========================= */}

            <div className="sale-delete-buttons">

              {/* CANCEL */}

              <button

                type="button"

                className="cancel-sale-delete"

                onClick={cancelDelete}

                onTouchEnd={cancelDelete}

              >

                Cancel

              </button>


              {/* CONFIRM */}

              <button

                type="button"

                className="confirm-sale-delete"

                onClick={confirmDelete}

                onTouchEnd={(e) => {

                  e.preventDefault();
                  e.stopPropagation();

                  confirmDelete();

                }}

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