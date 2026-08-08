import { useState } from "react";
import "./SalesHistory.css";


function SalesHistory({
  sales,
  onDeleteSale
}) {


  const [saleToDelete, setSaleToDelete] =
    useState(null);


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


      <div className="sales-history-header">

        <div>

          <h2>
            🧾 Sales History
          </h2>

          <p>
            View all recorded sales.
          </p>

        </div>

      </div>


      {sales.length === 0 ? (

        <div className="empty-sales">

          <span>
            🧾
          </span>

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


                <div className="sale-info">

                  <h3>
                    {sale.productName}
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


                <div className="sale-money">

                  <p>
                    Revenue:{" "}
                    <strong>
                      KSh{" "}
                      {Number(
                        sale.revenue
                      ).toLocaleString()}
                    </strong>
                  </p>

                  <p>
                    Profit:{" "}
                    <strong>
                      KSh{" "}
                      {Number(
                        sale.profit
                      ).toLocaleString()}
                    </strong>
                  </p>

                </div>


                <button
                  className="delete-sale-btn"
                  onClick={() =>
                    setSaleToDelete(sale)
                  }
                  title="Delete sale"
                >

                  🗑️

                </button>


              </div>

            ))}

        </div>

      )}


      {/* DELETE SALE MODAL */}

      {saleToDelete && (

        <div className="sale-delete-overlay">


          <div className="sale-delete-modal">


            <div className="sale-delete-icon">
              ⚠️
            </div>


            <h2>
              Delete Sale?
            </h2>


            <p>

              Are you sure you want to
              delete the sale for{" "}

              <strong>
                "{saleToDelete.productName}"
              </strong>
              ?

            </p>


            <p className="restore-message">

              📦 {saleToDelete.quantity} item(s)
              will be returned to stock.

            </p>


            <div className="sale-delete-buttons">


              <button
                className="cancel-sale-delete"
                onClick={() =>
                  setSaleToDelete(null)
                }
              >

                Cancel

              </button>


              <button
                className="confirm-sale-delete"
                onClick={confirmDelete}
              >

                🗑️ Delete Sale

              </button>


            </div>


          </div>


        </div>

      )}


    </div>

  );

}


export default SalesHistory;

