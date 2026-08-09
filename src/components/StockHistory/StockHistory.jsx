import "./StockHistory.css";


function StockHistory({
  history,
  onDeleteHistory
}) {


  if (!history || history.length === 0) {

    return (

      <div className="stock-history">

        <div className="stock-history-header">

          <div>

            <h2>
              📋 Stock Movement History
            </h2>

            <p>
              Track all stock movements in your shop.
            </p>

          </div>

        </div>


        <div className="stock-history-empty">

          <div className="empty-history-icon">
            📦
          </div>

          <h3>
            No stock movements yet
          </h3>

          <p>
            Stock additions, removals and sales
            will appear here.
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="stock-history">


      {/* =========================
          HEADER
      ========================= */}

      <div className="stock-history-header">

        <div>

          <h2>
            📋 Stock Movement History
          </h2>

          <p>
            Track all stock movements in your shop.
          </p>

        </div>


        <div className="history-count">

          {history.length} movement
          {history.length !== 1 ? "s" : ""}

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="stock-history-table-wrapper">

        <table className="stock-history-table">


          <thead>

            <tr>

              <th>
                Product
              </th>

              <th>
                Action
              </th>

              <th>
                Quantity
              </th>

              <th>
                Location
              </th>

              <th>
                Date
              </th>

              <th>
                Time
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {history.map((record) => {


              const actionClass =
                record.action
                  ?.toLowerCase()
                  .replace(/\s+/g, "-");


              return (

                <tr
                  key={record.id}
                >


                  {/* PRODUCT */}

                  <td>

                    <div className="history-product">

                      <div className="history-product-icon">

                        📦

                      </div>

                      <span>

                        {record.productName}

                      </span>

                    </div>

                  </td>


                  {/* ACTION */}

                  <td>

                    <span
                      className={
                        `history-action ${actionClass}`
                      }
                    >

                      {record.action}

                    </span>

                  </td>


                  {/* QUANTITY */}

                  <td>

                    <strong
                      className={
                        record.action === "Sold" ||
                        record.action === "Stock Removed"
                          ? "quantity-negative"
                          : "quantity-positive"
                      }
                    >

                      {record.action === "Sold" ||
                      record.action === "Stock Removed"
                        ? "-"
                        : "+"}

                      {record.quantity}

                    </strong>

                  </td>


                  {/* LOCATION */}

                  <td>

                    <span className="history-location">

                      {record.location}

                    </span>

                  </td>


                  {/* DATE */}

                  <td>

                    {record.date}

                  </td>


                  {/* TIME */}

                  <td>

                    {record.time}

                  </td>


                  {/* DELETE */}

                  <td>

                    <button

                      className="delete-history-btn"

                      onClick={() =>
                        onDeleteHistory &&
                        onDeleteHistory(
                          record.id
                        )
                      }

                      title="Delete history record"

                    >

                      🗑️

                    </button>

                  </td>


                </tr>

              );

            })}

          </tbody>

        </table>

      </div>


    </div>

  );

}


export default StockHistory;